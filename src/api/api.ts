// api.ts

import axios, { AxiosResponse } from 'axios';

interface Bean {
  id: number;
  name: string;
  description: string;
  // Add more fields as needed
}

const BASE_URL = 'http://127.0.0.1:8000/api/'; // Replace with your Django server address

const fetchBeans = async (): Promise<Bean[]> => {
  try {
    const response: AxiosResponse<Bean[]> = await axios.get(`${BASE_URL}beans/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching beans:', error);
    return [];
  }
};

export { fetchBeans };
