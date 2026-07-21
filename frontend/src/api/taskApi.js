import axiosClient from './axiosClient';

// Tasks API methods
export const taskApi = {
  // Fetch tasks with optional search, status, priority, and projectId filters
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.projectId) params.append('projectId', filters.projectId);

    const response = await axiosClient.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await axiosClient.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await axiosClient.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await axiosClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axiosClient.delete(`/tasks/${id}`);
    return response.data;
  }
};
