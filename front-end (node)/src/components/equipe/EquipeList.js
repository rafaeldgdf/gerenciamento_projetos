import React, { useEffect, useState } from 'react';
import { getAllEquipes, deleteEquipe } from '../../services/equipeService';
import { Link } from 'react-router-dom';
import '../../styles/EquipeList.css';

const EquipeList = () => {
  const [equipes, setEquipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEquipes();
  }, []);

  const loadEquipes = () => {
    getAllEquipes().then(response => {
      setEquipes(response.data);
    }).catch(error => {
      console.error('Erro ao carregar equipes:', error);
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar esta equipe?');
    if (confirmDelete) {
      deleteEquipe(id).then(() => {
        loadEquipes();
      }).catch(error => {
        console.error('Erro ao deletar equipe:', error);
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEquipes = equipes.filter(equipe => {
    const term = searchTerm.toLowerCase();
    return (
      equipe.nome.toLowerCase().includes(term) || 
      equipe.idEquipe.toString().toLowerCase().includes(term)
    );
  });

  return (
    <div className="list-container">
      <h1 className="title">Equipes</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nome ou ID..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="search-guide-text">
        <p><strong>Nome</strong> - ID da equipe</p>
      </div>
      <ul>
        {filteredEquipes.map(equipe => (
          <li key={equipe.idEquipe} className="equipe-item">
            <span className="equipe-info">
              <strong>{equipe.nome}</strong> - ID: {equipe.idEquipe}
            </span>
            <div className="button-group">
              <Link to={`/equipes/${equipe.idEquipe}`} className="button button-open">Abrir</Link>
              <Link to={`/equipes/editar/${equipe.idEquipe}`} className="button button-edit">Editar</Link>
              <button onClick={() => handleDelete(equipe.idEquipe)} className="button button-delete">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipeList;
