export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    detail? : string;
}

export interface ApiErrorResponse<T = any> {
    data : T;
    status : number;
}
