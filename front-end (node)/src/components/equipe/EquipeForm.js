import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllUsuarios } from '../../services/usuarioService';
import { createEquipe, getEquipeById, updateEquipe } from '../../services/equipeService';
import '../../styles/EquipeForm.css';

const EquipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialEquipeState = {
    nome: '',
    descricao: '',
    usuarioMatriculas: []
  };

  const [equipe, setEquipe] = useState(initialEquipeState);
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [generatedId, setGeneratedId] = useState(null);

  useEffect(() => {
    loadUsuarios();
    if (id) {
      loadEquipe(id);
    }
  }, [id]);

  const loadUsuarios = () => {
    getAllUsuarios().then(response => {
      setUsuarios(response.data);
    }).catch(error => {
      console.error('Erro ao carregar usuários:', error);
    });
  };

  const loadEquipe = (id) => {
    getEquipeById(id).then(response => {
      const equipeData = response.data;
      setEquipe({
        ...equipeData,
        usuarioMatriculas: equipeData.usuarios.map(usuario => usuario.matricula)
      });
      setSelectedUsuarios(equipeData.usuarios);
    }).catch(error => {
      console.error('Erro ao carregar equipe:', error);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipe({
      ...equipe,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setEquipe((prevState) => {
      const usuarioMatriculas = checked
        ? [...prevState.usuarioMatriculas, value]
        : prevState.usuarioMatriculas.filter((matricula) => matricula !== value);
      const selected = checked
        ? [...selectedUsuarios, usuarios.find(usuario => usuario.matricula === value)]
        : selectedUsuarios.filter(usuario => usuario.matricula !== value);
      setSelectedUsuarios(selected);
      return { ...prevState, usuarioMatriculas };
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validarEquipe(equipe);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (id) {
      updateEquipe(id, equipe).then(() => {
        setSuccessMessage('Equipe atualizada com sucesso.');
        setTimeout(() => {
          navigate(`/equipes/${id}`);
        }, 1000);
      }).catch(error => {
        console.error('Erro ao atualizar equipe:', error);
        setErrors([{ message: error.response ? error.response.data.message : 'Erro ao salvar a equipe' }]);
      });
    } else {
      createEquipe(equipe).then(response => {
        setSuccessMessage('Equipe cadastrada com sucesso.');
        setGeneratedId(response.data.id);
        setTimeout(() => {
          setEquipe(initialEquipeState);
          setSelectedUsuarios([]);
          setSuccessMessage('');
        }, 10000); // Zerar o formulário após 10 segundos
      }).catch(error => {
        console.error('Erro ao criar equipe:', error);
        setErrors([{ message: error.response ? error.response.data.message : 'Erro ao salvar a equipe' }]);
      });
    }
  };

  const validarEquipe = (equipe) => {
    const validationErrors = [];

    if (!equipe.nome.trim()) {
      validationErrors.push({ field: 'nome', message: 'Nome não pode ser nulo ou vazio' });
    }

    if (!equipe.descricao.trim()) {
      validationErrors.push({ field: 'descricao', message: 'Descrição não pode ser nula ou vazia' });
    }

    if (equipe.usuarioMatriculas.length === 0) {
      validationErrors.push({ field: 'usuarios', message: 'Selecione ao menos um usuário' });
    }

    return validationErrors;
  };

  const handleNewEquipe = () => {
    setEquipe(initialEquipeState);
    setSearchTerm('');
    setSuccessMessage('');
    setSelectedUsuarios([]);
    setGeneratedId(null);
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const term = searchTerm.toLowerCase();
    return (
      usuario.nome.toLowerCase().includes(term) || 
      usuario.centroCusto.toLowerCase().includes(term) || 
      usuario.matricula.toLowerCase().includes(term)
    );
  });

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="subtitle">{id ? 'Editar Equipe' : 'Cadastro de Equipe'}</h2>
      <button type="button" onClick={handleNewEquipe} className="new-equipe-button">Limpar tudo</button>
      <div className={`form-field ${errors.some(error => error.field === 'nome') ? 'field-error' : ''}`}>
        <label>Nome *</label>
        <input
          type="text"
          name="nome"
          value={equipe.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'descricao') ? 'field-error' : ''}`}>
        <label>Descrição *</label>
        <textarea
          name="descricao"
          value={equipe.descricao}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-field">
        <label>Pesquisar Usuários</label>
        <input
          type="text"
          placeholder="Pesquisar por nome, centro de custo ou matrícula..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'usuarios') ? 'field-error' : ''}`}>
        <label>Usuários *</label>
        <ul className="user-list">
          {filteredUsuarios.map(usuario => (
            <li key={usuario.matricula}>
                <input
                  type="checkbox"
                  value={usuario.matricula}
                  onChange={handleCheckboxChange}
                  checked={equipe.usuarioMatriculas.includes(usuario.matricula)}
                />
                <span className="usuario-nome"><strong>{usuario.nome}</strong></span> 
                <span className="usuario-status"> - <em>{usuario.statusUsuarioDescricao}</em></span> 
                <span className="usuario-centroCusto"> - {usuario.centroCusto}</span> 
                <span className="usuario-matricula"> - {usuario.matricula}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="form-field">
        <label>Membros da Equipe</label>
        <ul className="selected-user-list">
          {selectedUsuarios.map(usuario => (
            <li key={usuario.matricula}>
              <span className="usuario-nome"><strong>{usuario.nome}</strong></span> 
              <span className="usuario-status"> - <em>{usuario.statusUsuarioDescricao}</em></span> 
              <span className="usuario-centroCusto"> - {usuario.centroCusto}</span> 
              <span className="usuario-matricula"> - {usuario.matricula}</span>
            </li>
          ))}
        </ul>
      </div>
      {errors.length > 0 && (
        <div className="error">
          {errors.map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
      {successMessage && (
        <div className="success">
          <p>{successMessage}</p>
          {generatedId && <p>ID da Equipe: {generatedId}</p>}
        </div>
      )}
      <div className="button-container">
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
};

export default EquipeForm;
