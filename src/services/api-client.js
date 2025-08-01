import axios from 'axios';
import { config } from '../config/index.js';

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.api.url,
      timeout: config.api.timeout,
    });
  }

  async get(endpoint, headers = {}) {
    try {
      const response = await this.client.get(endpoint, { headers });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(endpoint, data, headers = {}) {
    try {
      const response = await this.client.post(endpoint, data, { headers });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(endpoint, data, headers = {}) {
    try {
      const response = await this.client.put(endpoint, data, { headers });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(endpoint, headers = {}) {
    try {
      const response = await this.client.delete(endpoint, { headers });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error ||
                     error.response.data?.errors?.join(', ') ||
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
