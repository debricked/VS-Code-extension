import axios from "axios";
import { AuthHelper } from "./authHelper";
import { Organization } from "../constants/index";
import { RequestParam } from "../types";
import { ErrorHandler } from "./errorHandler";

export class ApiHelper {
    private static async getHeaders(): Promise<{ [key: string]: string }> {
        const token = await AuthHelper.getToken(true, Organization.bearer);
        if (token) {
            return {
                accept: "*/*",
                Authorization: token,
            };
        }
        return {};
    }

    public static async fetch(requestParam: RequestParam): Promise<any> {
        const endpoint = requestParam.endpoint;
        const url = `${Organization.baseUrl}${endpoint}?page=${requestParam.page}&rowsPerPage=${requestParam.rowsPerPage}`;

        try {
            const headers = await this.getHeaders();
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error: any) {
            ErrorHandler.handleError(error);
        }
    }
}
