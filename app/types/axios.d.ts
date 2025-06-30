import type { AxiosRequestConfig } from "axios";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    meta?: {
        allowAnonymous?: boolean;
    };
}