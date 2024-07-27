// src/components/ProjetoList.js
import React, { useEffect, useState } from 'react';
import { getAllProjetos, deleteProjeto } from '../services/projetoService';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import '../styles/ProjectList.css';

const ProjetoList = () => {
  const [projetos, setProjetos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nome');

  useEffect(() => {
    loadProjetos();
  }, []);

  const loadProjetos = () => {
    getAllProjetos().then(response => {
      setProjetos(response.data);
    }).catch(error => {
      console.error('Erro ao carregar projetos:', error);
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este projeto?');
    if (confirmDelete) {
      deleteProjeto(id).then(() => {
        loadProjetos();
      }).catch(error => {
        console.error('Erro ao deletar projeto:', error);
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const filteredProjetos = projetos.filter(projeto => {
    const term = searchTerm.toLowerCase();
    if (searchField === 'nome') {
      return projeto.nome.toLowerCase().includes(term);
    } else if (searchField === 'status') {
      return projeto.statusProjeto.toLowerCase().includes(term);
    } else if (searchField === 'centroCusto') {
      return projeto.centroCusto.toLowerCase().includes(term);
    } else if (searchField === 'flags') {
      return projeto.flags.toLowerCase().includes(term);
    } else {
      return projeto.matricula.toLowerCase().includes(term);
    }
  });

  return (
    <div className="list-container">
      <h1 className="title">Projetos</h1>
      <div className="search-container">
        <select value={searchField} onChange={handleSearchFieldChange}>
          <option value="nome">Nome</option>
          <option value="status">Status</option>
          <option value="centroCusto">Centro de Custo</option>
          <option value="matricula">Matrícula do Projeto</option>
          <option value="flags">Flags</option>
        </select>
        <input
          type="text"
          placeholder={`Buscar por ${searchField}...`}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="legend-and-guide">
        <div className="legend">
          <div className="legend-item verde"></div><span className="legend-text">Verde: Tudo está indo conforme o planejado.</span>
          <div className="legend-item amarelo"></div><span className="legend-text">Amarelo: Atenção necessária; existem problemas menores.</span>
          <div className="legend-item vermelho"></div><span className="legend-text">Vermelho: Problemas críticos; ação imediata necessária.</span>
          <div className="legend-item azul"></div><span className="legend-text">Azul: Em revisão ou sob análise.</span>
          <div className="legend-item cinza"></div><span className="legend-text">Cinza: Sem status definido ou aguardando informações.</span>
          <div className="legend-item laranja"></div><span className="legend-text">Laranja: Risco potencial.</span>
        </div>
      </div>
      <div className="search-guide-text">
        <p><strong>Nome</strong> - <em>Status</em> - Centro de Custo - Matrícula do Projeto</p>
      </div>
      <ul>
        {filteredProjetos.map(projeto => (
          <li key={projeto.idProjeto} className={`projeto-item ${projeto.flags}`}>
            <span className="projeto-info">
              <strong>{projeto.nome}</strong> - <em>{projeto.statusProjeto}</em> - {capitalize(projeto.centroCusto)} - {projeto.matricula}
            </span>
            <div className="button-group">
              <Link to={`/projetos/${projeto.idProjeto}`} className="button button-open">Abrir</Link>
              <Link to={`/projetos/editar/${projeto.idProjeto}`} className="button button-edit">Editar</Link>
              <button onClick={() => handleDelete(projeto.idProjeto)} className="button button-delete">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjetoList;
