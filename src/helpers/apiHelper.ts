import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthHelper } from "./authHelper";
import { ApiEndpoints } from "../constants/index";
import { Logger } from "./loggerHelper";

export class ApiHelper {
    // Method to get repositories
    public static async getRepositories(
        page: number = 1,
        rowsPerPage: number = 25,
        order: string = "asc",
    ): Promise<AxiosResponse<any>> {
        try {
            // Get the bearer token
            const token = await AuthHelper.getToken(false, "bearer");
            Logger.logDebug(`Fetched Token: ${token}`); // Log the token for debugging

            // Define the URL with query parameters
            const url = `${ApiEndpoints.BASE_URL}/api/1.0/open/repositories/get-repositories`;
            const params = {
                page,
                rowsPerPage,
                order,
            };

            // Define the request configuration
            const config: AxiosRequestConfig = {
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${token}`,
                },
                params,
            };

            // Execute the GET request
            const response = await axios.get(url, config);

            // Return the response
            return response;
        } catch (error: any) {
            // Log the error (you can improve error handling as needed)
            Logger.logError(`Error fetching repositories: ${error.stack}`);
            throw error;
        }
    }
}
