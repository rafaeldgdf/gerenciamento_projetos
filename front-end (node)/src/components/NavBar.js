// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Início</Link></li>
        <li><Link to="/usuarios/novo">Novo Usuário</Link></li>
        <li><Link to="/equipes/novo">Nova Equipe</Link></li>
        <li><Link to="/projetos/novo">Novo Projeto</Link></li>
        <li><Link to="/usuarios">Usuários</Link></li>
        <li><Link to="/equipes">Equipes</Link></li>
        <li><Link to="/projetos">Projetos</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
