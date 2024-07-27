import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EquipeList from '../components/equipe/EquipeList';
import EquipeDetail from '../components/equipe/EquipeDetail';
import EquipeForm from '../components/equipe/EquipeForm';

const EquipePage = () => {
  return (
    <Routes>
      <Route path="/" element={<EquipeList />} />
      <Route path="/:id" element={<EquipeDetail />} />
      <Route path="/editar/:id" element={<EquipeForm />} />
      <Route path="/novo" element={<EquipeForm />} />
    </Routes>
  );
};

export default EquipePage;
