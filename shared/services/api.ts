import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface ApiResponse<TResponse> {
  data?: TResponse;
  error?: string;
}

export class Api<TRequest, TResponse> {
  private axiosInstance: AxiosInstance;

  constructor(token:string = "", private baseURL: string = "https://c1fd-2a0c-5a86-d203-b800-9d3f-75a4-f562-2ba4.ngrok-free.app/api") {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });
    if(token != ""){
      this.axiosInstance.defaults.headers.common['Authorization'] = token;
    }
  }

  public async get(endpoint: string): Promise<ApiResponse<TResponse>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(endpoint);
      return {
        data: response.data,
      };
    } catch (error:any) {
      return {
        data: null!,
        error: this.handleError(error),
      };
    }
  }

  public async post(endpoint: string, body: TRequest): Promise<ApiResponse<TResponse>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(endpoint, body);
      return {
        data: response.data,
      };
    } catch (error:any) {
      return {
        data: null!,
        error: this.handleError(error),
      };
    }
  }

  public async put(endpoint: string, body: TRequest): Promise<ApiResponse<TResponse>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(endpoint, body);
      return {
        data: response.data,
      };
    } catch (error:any) {
      return {
        data: null!,
        error: this.handleError(error),
      };
    }
  }

  public async delete(endpoint: string): Promise<ApiResponse<TResponse>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.delete(endpoint);
      return {
        data: response.data,
      };
    } catch (error:any) {
      return {
        data: null!,
        error: this.handleError(error),
      };
    }
  }

  private handleError(error: AxiosError): string {
    if (error.message) {
      return error.message;
    } else {
      return 'Unable to make request.';
    }
  }
}