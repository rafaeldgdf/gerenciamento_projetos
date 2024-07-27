import React, { useEffect, useState } from 'react';
import { getAllUsuarios, deleteUsuario } from '../../services/usuarioService';
import { Link } from 'react-router-dom';
import '../../styles/UsuarioList.css';

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('nome');

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = () => {
    getAllUsuarios().then(response => {
      setUsuarios(response.data);
    }).catch(error => {
      console.error('Erro ao carregar usuários:', error);
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este usuário?');
    if (confirmDelete) {
      deleteUsuario(id).then(() => {
        loadUsuarios();
      }).catch(error => {
        console.error('Erro ao deletar usuário:', error);
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

  const filteredUsuarios = usuarios.filter(usuario => {
    const term = searchTerm.toLowerCase();
    if (searchField === 'nome') {
      return usuario.nome.toLowerCase().includes(term);
    } else if (searchField === 'matricula') {
      return usuario.matricula.toLowerCase().includes(term);
    } else if (searchField === 'email') {
      return usuario.email.toLowerCase().includes(term);
    } else if (searchField === 'centroCusto') {
      return usuario.centroCusto.toLowerCase().includes(term);
    } else {
      return usuario.statusUsuarioDescricao.toLowerCase().includes(term);
    }
  });

  return (
    <div className="list-container">
      <h1 className="title">Usuários</h1>
      <div className="search-container">
        <select value={searchField} onChange={handleSearchFieldChange}>
          <option value="nome">Nome</option>
          <option value="email">Email</option>
          <option value="centroCusto">Centro de Custo</option>
          <option value="matricula">Matrícula</option>
          <option value="status">Status</option>
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
          <div className="legend-item verde"></div><span className="legend-text">Verde: Ativo</span>
          <div className="legend-item vermelho"></div><span className="legend-text">Vermelho: Inativo</span>
        </div>
      </div>
      <div className="search-guide-text">
        <p><strong>Nome</strong> - <em>Email</em> - <span>Centro de Custo</span> - <span>Matrícula do Usuário</span></p>
      </div>
      <ul>
        {filteredUsuarios.map(usuario => (
          <li key={usuario.idUsuario} className={`usuario-item ${usuario.statusUsuarioDescricao === 'Ativo' ? 'verde' : 'vermelho'}`}>
            <span className="usuario-info">
              <strong>{capitalize(usuario.nome)} {capitalize(usuario.ultimoNome)}</strong> - <i>{usuario.email.toLowerCase()}</i> - {capitalize(usuario.centroCusto)} - {usuario.matricula}
            </span>
            <div className="button-group">
              <Link to={`/usuarios/${usuario.idUsuario}`} className="button button-open">Abrir</Link>
              <Link to={`/usuarios/editar/${usuario.idUsuario}`} className="button button-edit">Editar</Link>
              <button onClick={() => handleDelete(usuario.idUsuario)} className="button button-delete">Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuarioList;
