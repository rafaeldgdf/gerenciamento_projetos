import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getProjetoById, updateProjeto } from '../services/projetoService';
import { getAllEquipes, getEquipeById } from '../services/equipeService';
import moment from 'moment-timezone';
import '../styles/App.css';

const ProjetoFormEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialProjetoState = {
    nome: '',
    centroCusto: 'Desenvolvimento',
    dtInicio: '',
    dtTerminoPrevista: '',
    statusProjeto: 'Em andamento',
    orcamento: '',
    descricao: '',
    flags: 'Cinza',
    idEquipe: '',
    gerenteMatricula: ''
  };

  const [projeto, setProjeto] = useState(initialProjetoState);
  const [equipes, setEquipes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const loadEquipes = useCallback(() => {
    getAllEquipes().then(response => {
      setEquipes(response.data);
    }).catch(error => {
      console.error('Erro ao carregar equipes:', error);
    });
  }, []);

  const loadUsuarios = useCallback((equipeId) => {
    getEquipeById(equipeId).then(response => {
      setUsuarios(response.data.usuarios); // Certifique-se de que 'usuarios' está sendo retornado pela API
    }).catch(error => {
      console.error('Erro ao carregar usuários:', error);
    });
  }, []);

  const loadProjeto = useCallback((id) => {
    getProjetoById(id).then(response => {
      const projetoData = response.data;
      setProjeto({
        ...projetoData,
        dtInicio: moment(projetoData.dtInicio).format('YYYY-MM-DD'),
        dtTerminoPrevista: moment(projetoData.dtTerminoPrevista).format('YYYY-MM-DD')
      });
      loadUsuarios(projetoData.idEquipe);
    }).catch(error => {
      console.error('Erro ao carregar projeto:', error);
    });
  }, [loadUsuarios]);

  useEffect(() => {
    loadEquipes();
    if (id) {
      loadProjeto(id);
    }
  }, [id, loadEquipes, loadProjeto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjeto({
      ...projeto,
      [name]: value
    });
  };

  const handleEquipeChange = (selectedOption) => {
    const equipeId = selectedOption ? selectedOption.value : '';
    setProjeto({
      ...projeto,
      idEquipe: equipeId,
      gerenteMatricula: ''
    });
    if (equipeId) {
      loadUsuarios(equipeId);
    } else {
      setUsuarios([]);
    }
  };

  const handleGerenteChange = (selectedOption) => {
    setProjeto({
      ...projeto,
      gerenteMatricula: selectedOption ? selectedOption.value : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validarProjeto(projeto);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateProjeto(id, projeto).then(() => {
      setSuccessMessage('Projeto atualizado com sucesso.');
      setTimeout(() => {
        navigate(`/projetos/${id}`);
      }, 1000);
    }).catch(handleError);
  };

  const validarProjeto = (projeto) => {
    const validationErrors = [];
    const minLength = 3;
    const maxLength = 50;

    const checkLength = (field, value, fieldName) => {
      if (value.length < minLength) {
        validationErrors.push({ field, message: `${fieldName} deve ter pelo menos ${minLength} caracteres.` });
      } else if (value.length > maxLength) {
        validationErrors.push({ field, message: `${fieldName} deve ter no máximo ${maxLength} caracteres.` });
      }
    };

    if (!projeto.nome.trim()) {
      validationErrors.push({ field: 'nome', message: 'Nome do projeto não pode ser nulo ou vazio' });
    } else {
      checkLength('nome', projeto.nome.trim(), 'Nome do projeto');
    }

    if (!projeto.centroCusto.trim()) {
      validationErrors.push({ field: 'centroCusto', message: 'Centro de custo não pode ser nulo ou vazio' });
    }

    if (!projeto.idEquipe) {
      validationErrors.push({ field: 'idEquipe', message: 'ID da equipe não pode ser nulo' });
    }

    if (!projeto.gerenteMatricula.trim()) {
      validationErrors.push({ field: 'gerenteMatricula', message: 'Matrícula do gerente não pode ser nula ou vazia' });
    } else {
      checkLength('gerenteMatricula', projeto.gerenteMatricula.trim(), 'Matrícula do gerente');
    }

    return validationErrors;
  };

  const handleError = (error) => {
    setErrors([{ message: error.response ? error.response.data.message : 'Erro ao salvar o projeto' }]);
  };

  const handleNewProjeto = () => {
    setProjeto(initialProjetoState);
    setErrors([]);
    setSuccessMessage('');
    setUsuarios([]);
  };

  const centrosCusto = [
    "Desenvolvimento", "Arquitetura", "Engenharia", "Operação",
    "Design", "Projeto", "Dados", "Financeiro", "TI", "RH"
  ];

  const statusOptions = [
    "Em andamento", "Não iniciado", "Concluído", "Em espera", "Cancelado", "Atrasado", "Revisão", "Fechado"
  ];

  const flagOptions = [
    "Cinza", "Verde", "Amarelo", "Vermelho", "Azul", "Laranja"
  ];

  const equipeOptions = equipes.map(equipe => ({
    value: equipe.idEquipe,
    label: <><strong>{equipe.nome}</strong> - ID: {equipe.idEquipe}</>
  }));

  const gerenteOptions = usuarios.map(usuario => ({
    value: usuario.matricula,
    label: (
      <>
        <strong>{usuario.nome}</strong> - <i>{usuario.statusUsuarioDescricao}</i> - {usuario.centroCusto} - {usuario.matricula}
      </>
    )
  }));

  const filterOption = (option, inputValue) => {
    return (
      option.label.props.children[0].props.children.toLowerCase().includes(inputValue.toLowerCase()) || // Match by name
      option.value.toString().toLowerCase().includes(inputValue.toLowerCase()) // Match by ID
    );
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="subtitle">{`Editar ${projeto.nome}`}</h2>
      <button type="button" onClick={handleNewProjeto} className="">Limpar tudo</button>
      <div className={`form-field ${errors.some(error => error.field === 'nome') ? 'field-error' : ''}`}>
        <label>Nome *</label>
        <input
          type="text"
          name="nome"
          value={projeto.nome}
          onChange={handleChange}
          required
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'centroCusto') ? 'field-error' : ''}`}>
        <label>Centro de Custo *</label>
        <select
          name="centroCusto"
          value={projeto.centroCusto}
          onChange={handleChange}
        >
          {centrosCusto.map(centro => (
            <option key={centro} value={centro}>{centro}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Data de Início *</label>
        <input
          type="text"
          name="dtInicio"
          value={projeto.dtInicio}
          disabled
        />
      </div>
      <div className="form-field">
        <label>Data de Término Prevista *</label>
        <input
          type="text"
          name="dtTerminoPrevista"
          value={projeto.dtTerminoPrevista}
          disabled
        />
      </div>
      <div className="form-field">
        <label>Status</label>
        <select
          name="statusProjeto"
          value={projeto.statusProjeto}
          onChange={handleChange}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Orçamento</label>
        <input
          type="number"
          name="orcamento"
          value={projeto.orcamento}
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label>Descrição</label>
        <textarea
          name="descricao"
          value={projeto.descricao}
          onChange={handleChange}
        />
      </div>
      <div className="form-field">
        <label>Flag</label>
        <select
          name="flags"
          value={projeto.flags}
          onChange={handleChange}
        >
          {flagOptions.map(flag => (
            <option key={flag} value={flag}>{flag}</option>
          ))}
        </select>
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'idEquipe') ? 'field-error' : ''}`}>
        <label>Equipe *</label>
        <Select
          options={equipeOptions}
          onChange={handleEquipeChange}
          value={equipeOptions.find(option => option.value === projeto.idEquipe)}
          placeholder="Selecione..."
          noOptionsMessage={() => "Sem opções"}
          filterOption={filterOption}
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'gerenteMatricula') ? 'field-error' : ''}`}>
        <label>Gerente *</label>
        <Select
          options={gerenteOptions}
          onChange={handleGerenteChange}
          value={gerenteOptions.find(option => option.value === projeto.gerenteMatricula)}
          placeholder="Selecione..."
          noOptionsMessage={() => "Sem opções"}
          filterOption={filterOption}
        />
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
        </div>
      )}
      <div className="button-container">
        <button type="submit">Salvar</button>
      </div>
    </form>
  );
};

export default ProjetoFormEdit;
