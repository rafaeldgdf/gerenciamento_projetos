import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipeById } from '../../services/equipeService';
import '../../styles/EquipeDetail.css';

const EquipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState(null);

  useEffect(() => {
    const loadEquipe = async () => {
      try {
        const response = await getEquipeById(id);
        setEquipe(response.data);
      } catch (error) {
        console.error('Erro ao carregar equipe:', error);
      }
    };
    loadEquipe();
  }, [id]);

  if (!equipe) return <div>Carregando...</div>;

  return (
    <div className="detail-container">
      <div className="detail-box">
        <h1>Detalhes da {equipe.nome}</h1>
        <p><strong>Nome:</strong> {equipe.nome}</p>
        <p><strong>Descrição:</strong> {equipe.descricao}</p>
        <h2>Usuários</h2>
        <ul>
          {equipe.usuarios.map(usuario => (
            <li key={usuario.matricula}>
              <strong>{usuario.nome} {usuario.ultimoNome}</strong> - <em>{usuario.statusUsuarioDescricao}</em> - {usuario.matricula} - {usuario.email}
            </li>
          ))}
        </ul>
        <div className="button-container">
          <button className="edit-button" onClick={() => navigate(`/equipes/editar/${id}`)}>Editar</button>
        </div>
        <div className="back-link-container">
          <a className="back-link" onClick={() => navigate('/equipes')}>Voltar</a>
        </div>
      </div>
    </div>
  );
};

export default EquipeDetail;
