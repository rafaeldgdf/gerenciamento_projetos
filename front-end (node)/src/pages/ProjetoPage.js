import React, { useState, useEffect } from 'react';
import ProjetoForm from '../components/ProjetoForm';
import ProjetoList from '../components/ProjetoList';
import { getAllProjetos, deleteProjeto } from '../services/projetoService';

const ProjetoPage = () => {
  const [projetos, setProjetos] = useState([]);
  const [selectedProjetoId, setSelectedProjetoId] = useState(null);

  useEffect(() => {
    fetchProjetos();
  }, []);

  const fetchProjetos = () => {
    getAllProjetos().then(response => {
      setProjetos(response.data);
    }).catch(error => {
      console.error('Erro ao carregar projetos:', error);
    });
  };

  const handleEdit = (id) => {
    setSelectedProjetoId(id);
  };

  const handleSave = () => {
    setSelectedProjetoId(null);
    fetchProjetos();
  };

  const handleDelete = (id) => {
    deleteProjeto(id).then(() => {
      fetchProjetos();
    }).catch(error => {
      console.error('Erro ao deletar projeto:', error);
    });
  };

  return (
    <div>
      <h1 className="title">Gerenciamento de Projetos</h1>
      <div className="form-container">
        <ProjetoForm id={selectedProjetoId} onSave={handleSave} />
      </div>
      <ProjetoList projetos={projetos} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default ProjetoPage;
