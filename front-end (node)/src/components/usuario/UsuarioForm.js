import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createUsuario, getUsuarioById, updateUsuario } from '../../services/usuarioService';
import '../../styles/UsuarioForm.css';

const UsuarioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const initialUsuarioState = {
    nome: '',
    ultimoNome: '',
    dtNascimento: '',
    email: '',
    centroCusto: 'Desenvolvimento',
    statusUsuario: false,
    statusUsuarioDescricao: 'Ativo',
  };

  const [usuario, setUsuario] = useState(initialUsuarioState);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      getUsuarioById(id).then(response => {
        const usuarioData = response.data;
        setUsuario({
          ...usuarioData,
          dtNascimento: usuarioData.dtNascimento ? usuarioData.dtNascimento.split('T')[0] : ''
        });
      }).catch(error => {
        console.error('Erro ao carregar usuário:', error);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: name === 'statusUsuario' ? e.target.checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validarUsuario(usuario);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (id) {
      updateUsuario(id, usuario).then(() => {
        setSuccessMessage('Usuário atualizado com sucesso.');
        setTimeout(() => {
          setUsuario(initialUsuarioState);
          setErrors([]);
          setSuccessMessage('');
          navigate(`/usuarios/${id}`); // Redireciona para a página de detalhes do usuário
        }, 1000); // Zerar o formulário após 10 segundos
      }).catch(handleError);
    } else {
      createUsuario(usuario).then((response) => {
        setSuccessMessage('Usuário cadastrado com sucesso.');
        setTimeout(() => {
          setUsuario(initialUsuarioState);
          setErrors([]);
          setSuccessMessage('');
          navigate(`/usuarios/${response.data.idUsuario}`); // Redireciona para a página de detalhes do novo usuário
        }, 10000); // Zerar o formulário após 10 segundos
      }).catch(handleError);
    }
  };

  const validarUsuario = (usuario) => {
    const validationErrors = [];

    if (!usuario.nome.trim()) {
      validationErrors.push({ field: 'nome', message: 'Nome não pode ser nulo ou vazio' });
    }

    if (!usuario.ultimoNome.trim()) {
      validationErrors.push({ field: 'ultimoNome', message: 'Último nome não pode ser nulo ou vazio' });
    }

    if (!usuario.dtNascimento) {
      validationErrors.push({ field: 'dtNascimento', message: 'Data de nascimento não pode ser nula' });
    }

    if (!usuario.email.trim()) {
      validationErrors.push({ field: 'email', message: 'Email não pode ser nulo ou vazio' });
    }

    if (!usuario.centroCusto.trim()) {
      validationErrors.push({ field: 'centroCusto', message: 'Centro de custo não pode ser nulo ou vazio' });
    }

    return validationErrors;
  };

  const handleError = (error) => {
    setErrors([{ message: error.response ? error.response.data.message : 'Erro ao salvar o usuário' }]);
  };

  const handleNewUsuario = () => {
    setUsuario(initialUsuarioState);
    setErrors([]);
    setSuccessMessage('');
  };

  const centrosCusto = [
    "Desenvolvimento", "Arquitetura", "Engenharia", "Operação",
    "Design", "Projeto", "Dados", "Financeiro", "TI", "RH"
  ];

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="subtitle">{id ? `Editar ${usuario.nome}` : 'Cadastro de Usuário'}</h2>
      <button type="button" onClick={handleNewUsuario} className="">Limpar tudo</button>
      <div className={`form-field ${errors.some(error => error.field === 'nome') ? 'field-error' : ''}`}>
        <label>Nome *</label>
        <input
          type="text"
          name="nome"
          value={usuario.nome}
          onChange={handleChange}
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'ultimoNome') ? 'field-error' : ''}`}>
        <label>Último Nome *</label>
        <input
          type="text"
          name="ultimoNome"
          value={usuario.ultimoNome}
          onChange={handleChange}
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'dtNascimento') ? 'field-error' : ''}`}>
        <label>Data de Nascimento *</label>
        <input
          type="date"
          name="dtNascimento"
          value={usuario.dtNascimento}
          onChange={handleChange}
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'email') ? 'field-error' : ''}`}>
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={usuario.email}
          onChange={handleChange}
        />
      </div>
      <div className={`form-field ${errors.some(error => error.field === 'centroCusto') ? 'field-error' : ''}`}>
        <label>Centro de Custo *</label>
        <select
          name="centroCusto"
          value={usuario.centroCusto}
          onChange={handleChange}
        >
          {centrosCusto.map(centro => (
            <option key={centro} value={centro}>{centro}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Status</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="statusUsuario"
              value="Ativo"
              checked={usuario.statusUsuario === true}
              onChange={() => setUsuario({ ...usuario, statusUsuario: true, statusUsuarioDescricao: 'Ativo' })}
            />
            Ativo
          </label>
          <label>
            <input
              type="radio"
              name="statusUsuario"
              value="Inativo"
              checked={usuario.statusUsuario === false}
              onChange={() => setUsuario({ ...usuario, statusUsuario: false, statusUsuarioDescricao: 'Inativo' })}
            />
            Inativo
          </label>
        </div>
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

export default UsuarioForm;
