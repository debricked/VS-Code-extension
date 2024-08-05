import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AuthHelper } from "./authHelper";
import { ErrorHandler } from "./errorHandler";
import { Logger } from "./loggerHelper";
import { Organization } from "../constants/index";

export class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(
        authHelper: AuthHelper,
        private errorHandler: ErrorHandler,
        private logger: typeof Logger,
    ) {
        this.axiosInstance = axios.create();

        this.axiosInstance.interceptors.request.use(
            async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
                const token = await authHelper.getToken(true, Organization.bearer);
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
        return this.axiosInstance.get<T>(url, config).then((response) => response.data);
    }

    public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.axiosInstance.post<T>(url, data, config).then((response) => response.data);
    }

    // Add other methods (put, delete, etc.) as needed
}
