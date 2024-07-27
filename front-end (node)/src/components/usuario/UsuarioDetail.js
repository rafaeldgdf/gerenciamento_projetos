import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsuarioById } from '../../services/usuarioService';
import '../../styles/UsuarioDetail.css';

const UsuarioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const loadUsuario = async () => {
      try {
        const response = await getUsuarioById(id);
        setUsuario(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };
    loadUsuario();
  }, [id]);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (!usuario) return <div>Carregando...</div>;

  const { nome, ultimoNome, dtNascimento, email, centroCusto, statusUsuarioDescricao } = usuario;

  return (
    <div className="detail-container">
      <div className={`detail-box ${statusUsuarioDescricao === 'Ativo' ? 'verde' : 'vermelho'}`}>
        <h1>Detalhes de {capitalize(nome)} {capitalize(ultimoNome)}</h1>
        <p><strong>Nome:</strong> {capitalize(nome)}</p>
        <p><strong>Último Nome:</strong> {capitalize(ultimoNome)}</p>
        <p><strong>Data de Nascimento:</strong> {new Date(dtNascimento).toLocaleDateString()}</p>
        <p><strong>Email:</strong> {email.toLowerCase()}</p>
        <p><strong>Centro de Custo:</strong> {capitalize(centroCusto)}</p>
        <p><strong>Status:</strong> {statusUsuarioDescricao}</p>
        <div className="button-container">
          <button className="edit-button" onClick={() => navigate(`/usuarios/editar/${id}`)}>Editar</button>
        </div>
        <div className="back-link-container">
          <a className="back-link" onClick={() => navigate('/usuarios')}>Voltar</a>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDetail;
