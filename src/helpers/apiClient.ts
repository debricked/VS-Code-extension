import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AuthHelper } from "./authHelper";
import { ErrorHandler } from "./errorHandler";
import { Logger } from "./loggerHelper";
import { TokenType } from "../constants";
import * as Sentry from "@sentry/node";

export class ApiClient {
    public axiosInstance: AxiosInstance;

    constructor(
        authHelper: AuthHelper,
        private errorHandler: ErrorHandler,
        private logger: typeof Logger,
    ) {
        this.axiosInstance = axios.create();

        this.axiosInstance.interceptors.request.use(
            async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
                const token = await authHelper.getToken(true, TokenType.BEARER);
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
                this.errorHandler.handleError(error);
                return Promise.reject(error);
            },
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                this.logger.logInfo(`Response: ${response.status} ${response.statusText}`);
                return response;
            },
            (error) => {
                this.errorHandler.handleError(error);
                return Promise.reject(error);
            },
        );
    }

    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return Sentry.startSpan({ name: "api-request", op: "http.client", startTime: new Date() }, async (span) => {
            return this.axiosInstance.get<T>(url, config).then((response) => {
                span.end(new Date());
                return response.data;
            });
        });
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.post<T>(url, data, config).then((response) => response.data);
    }

    // Add other methods (put, delete, etc.) as needed
}
