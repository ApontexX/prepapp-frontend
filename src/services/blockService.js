import api from './api';

export const getBlocks = async (folderId) => {
  const response = await api.get(`/blocks/folder/${folderId}`);
  return response.data;
};

export const createBlock = async (folderId, title, content) => {
  const response = await api.post(`/blocks/folder/${folderId}`, { title, content });
  return response.data;
};

export const updateBlock = async (id, title, content) => {
  const response = await api.put(`/blocks/${id}`, { title, content });
  return response.data;
};

export const deleteBlock = async (id) => {
  const response = await api.delete(`/blocks/${id}`);
  return response.data;
};