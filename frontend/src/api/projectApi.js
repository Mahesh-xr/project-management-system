import axiosClient from './axiosClient';

// Projects API methods
export const projectApi = {
  // Fetch projects with optional search string and status filter
  getProjects: async (search = '', status = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const response = await axiosClient.get(`/projects?${params.toString()}`);
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await axiosClient.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await axiosClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  }
};
