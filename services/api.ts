import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export interface ApiResponse<TResponse> {
  data?: TResponse;
  error?: string;
}

export class Api<TRequest> {
  private axiosInstance: AxiosInstance;

  constructor(private baseURL: string = "https://204e-2a0c-5a86-d200-5700-6138-48a1-9444-4cfc.ngrok-free.app/api") {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });
  }

  public async get(endpoint: string): Promise<ApiResponse<TRequest>> {
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

  public async post(endpoint: string, body: TRequest): Promise<ApiResponse<TRequest>> {
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

  public async put(endpoint: string, body: TRequest): Promise<ApiResponse<TRequest>> {
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

  public async delete(endpoint: string): Promise<ApiResponse<TRequest>> {
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