import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjetoById } from '../services/projetoService';
import '../styles/ProjetoDetail.css';

const ProjetoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);

  useEffect(() => {
    const loadProjeto = async () => {
      try {
        const response = await getProjetoById(id);
        setProjeto(response.data);
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
      }
    };
    loadProjeto();
  }, [id]);

  if (!projeto) return <div>Carregando...</div>;

  const { nome, matricula, centroCusto, dtInicio, dtTerminoPrevista, statusProjeto, orcamento, descricao, flags, equipe } = projeto;

  const gerente = equipe.usuarios.find(user => user.matricula === projeto.gerenteMatricula);

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="detail-container">
      <div className={`detail-box ${flags}`}>
        <h1>Detalhes do {nome}</h1>
        <p><strong>Nome:</strong> {nome}</p>
        <p><strong>Matrícula do Projeto:</strong> {matricula}</p>
        <p><strong>Centro de Custo:</strong> {centroCusto}</p>
        <p><strong>Data de Início:</strong> {new Date(dtInicio).toLocaleString()}</p>
        <p><strong>Data de Término Prevista:</strong> {new Date(dtTerminoPrevista).toLocaleString()}</p>
        <p><strong>Status:</strong> {statusProjeto}</p>
        <p><strong>Orçamento:</strong> {formatCurrency(orcamento)}</p>
        <p><strong>Descrição:</strong> {descricao}</p>
        <p><strong>Flag:</strong> <span className="highlight">{flags}</span></p>
        <p><strong>ID da Equipe:</strong> {equipe.idEquipe}</p>
        <p><strong>Gerente:</strong> {gerente ? `${gerente.nome} (${gerente.matricula})` : 'N/A'}</p>
        <h2>Equipe</h2>
        <ul>
          {equipe.usuarios.map(usuario => (
            <li key={usuario.matricula} className={usuario.matricula === projeto.gerenteMatricula ? 'gerente' : ''}>
              {usuario.matricula === projeto.gerenteMatricula
                ? `${usuario.nome} (${usuario.matricula}) - ${usuario.email} - GERENTE`
                : `${usuario.nome} (${usuario.matricula}) - ${usuario.email}`}
            </li>
          ))}
        </ul>
        <div className="button-container">
          <button className="edit-button" onClick={() => navigate(`/projetos/editar/${id}`)}>Editar</button>
        </div>
        <div className="back-link-container">
          <a className="back-link" onClick={() => navigate('/projetos')}>Voltar</a>
        </div>
      </div>
    </div>
  );
};

export default ProjetoDetail;
