import api from './api';

export const getFolders = async () => {
  const response = await api.get('/folders');
  return response.data;
};

export const createFolder = async (name, description) => {
  const response = await api.post('/folders', { name, description });
  return response.data;
};

export const updateFolder = async (id, name, description) => {
  const response = await api.put(`/folders/${id}`, { name, description });
  return response.data;
};

export const deleteFolder = async (id) => {
  const response = await api.delete(`/folders/${id}`);
  return response.data;
};