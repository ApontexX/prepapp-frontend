import api from './api';

export const analyzeFolder = async (folderId, context) => {
  const response = await api.post(`/ai/analyze/${folderId}`, { context });
  return response.data;
};

export const chatWithAI = async (folderId, question, context) => {
  const response = await api.post(`/ai/chat/${folderId}`, { question, context });
  return response.data;
};