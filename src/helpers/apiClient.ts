import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AuthHelper } from "./auth.helper";
import { ErrorHandler } from "./errorHandler";
import { Logger } from "./logger.helper";
import { Secrets } from "../constants";
import * as Sentry from "@sentry/node";

export class ApiClient {
    public axiosInstance: AxiosInstance;

    constructor(
        authHelper: AuthHelper,
        private errorHandler: ErrorHandler,
        private logger: typeof Logger,
    ) {
        this.axiosInstance = axios.create({
            timeout: 10000,
            timeoutErrorMessage: "The request timed out. Please check your internet connection or try again later.",
        });

        this.axiosInstance.interceptors.request.use(
            async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
                const token = await authHelper.getToken(true, Secrets.BEARER);
                if (token) {
                    config.headers = {
                        ...config.headers,
                        Accept: "*/*",
                        Authorization: token,
                    };
                }
                this.logger.logInfo(`Request: ${config.method?.toUpperCase()} ${config.url}`);
                return config as InternalAxiosRequestConfig;
            },
            (error) => {
                const errorObj = new Error(`Error in interceptors request: ${error.message}`);
                this.errorHandler.handleError(errorObj);
                return Promise.reject(errorObj);
            },
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                this.logger.logInfo(`Response: ${response.status} ${response.statusText}`);
                return response;
            },
            (error) => {
                const errorObj = new Error(`Error in interceptors response: ${error.message}`);
                this.errorHandler.handleError(errorObj);
                return Promise.reject(errorObj);
            },
        );
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return Sentry.startSpan(
            {
                name: "api-request",
                op: "http.client",
                startTime: new Date(),
            },
            async (span) => {
                try {
                    const response = await this.axiosInstance.get<T>(url, config);
                    span.end(new Date());
                    return response.data;
                } catch (error: any) {
                    const errorObj = new Error(`Error in get request: ${error.message}`);
                    span.setStatus(error.code);
                    span.end(new Date());
                    Sentry.captureException(errorObj);
                    throw errorObj;
                }
            },
        );
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return Sentry.startSpan(
            {
                name: "api-request",
                op: "http.client",
                startTime: new Date(),
            },
            async (span) => {
                try {
                    const response = await this.axiosInstance.post<T>(url, data, config);
                    span.end(new Date());
                    return response.data;
                } catch (error: any) {
                    const errorObj = new Error(`Error in post request: ${error.message}`);
                    span.setStatus(error.code);
                    span.end(new Date());
                    Sentry.captureException(errorObj);
                    throw errorObj;
                }
            },
        );
    }

    // Add other methods (put, delete, etc.) as needed
}
