import axios from 'axios';

const API_URL = 'http://localhost:8080/equipes';

export const getAllEquipes = () => {
  return axios.get(API_URL);
};

export const getEquipeById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createEquipe = (equipe) => {
  return axios.post(API_URL, equipe);
};

export const updateEquipe = (id, equipe) => {
  return axios.put(`${API_URL}/${id}`, equipe);
};

export const deleteEquipe = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
