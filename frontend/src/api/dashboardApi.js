import axiosClient from './axiosClient';

// Dashboard Analytics API
export const dashboardApi = {
  getStats: async () => {
    const response = await axiosClient.get('/dashboard');
    return response.data;
  }
};
