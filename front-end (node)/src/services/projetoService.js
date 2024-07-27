import api from './api';

export const getAllProjetos = () => {
  return api.get('/projetos');
};

export const getProjetoById = (id) => {
  return api.get(`/projetos/${id}`);
};

export const createProjeto = (projeto) => {
  return api.post('/projetos', projeto);
};

export const updateProjeto = (id, projeto) => {
  return api.put(`/projetos/${id}`, projeto);
};

export const deleteProjeto = (id) => {
  return api.delete(`/projetos/${id}`);
};
