import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config/index.js';

interface RequestHeaders {
  [key: string]: string;
}

interface ErrorResponse {
  error?: string;
  errors?: string[];
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.url,
      timeout: config.api.timeout,
    });
  }

  async get<T = unknown>(
    endpoint: string,
    headers: RequestHeaders = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async post<T = unknown>(
    endpoint: string,
    data: unknown,
    headers: RequestHeaders = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(
        endpoint,
        data,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async put<T = unknown>(
    endpoint: string,
    data: unknown,
    headers: RequestHeaders = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(endpoint, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async delete<T = unknown>(
    endpoint: string,
    headers: RequestHeaders = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(endpoint, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as ErrorResponse;
      const message =
        responseData?.error ||
        responseData?.errors?.join(', ') ||
        error.message;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('No response from server');
    } else {
      // Something else happened
      return new Error(error.message);
    }
  }
}

export const apiClient = new ApiClient();
