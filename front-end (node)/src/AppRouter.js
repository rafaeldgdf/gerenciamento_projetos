import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjetoList from './components/ProjetoList';
import ProjetoForm from './components/ProjetoForm';
import ProjetoDetail from './components/ProjetoDetail';
import UsuarioForm from './components/usuario/UsuarioForm';
import UsuarioList from './components/usuario/UsuarioList';
import UsuarioDetail from './components/usuario/UsuarioDetail';
import NavBar from './components/NavBar';
import ProjetoFormEdit from './components/ProjetoFormEdit';
import EquipeForm from './components/equipe/EquipeForm';
import EquipeList from './components/equipe/EquipeList';
import EquipeDetail from './components/equipe/EquipeDetail';
import Home from './components/Home'; // Certifique-se de ter um componente Home

const AppRouter = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />  {/* Altere aqui para exibir a Home na raiz */}
        <Route path="/projetos" element={<ProjetoList />} />  {/* Adicione a rota para /projetos */}
        <Route path="/projetos/novo" element={<ProjetoForm />} />
        <Route path="/projetos/:id" element={<ProjetoDetail />} />
        <Route path="/projetos/editar/:id" element={<ProjetoFormEdit />} />
        <Route path="/usuarios/novo" element={<UsuarioForm />} />
        <Route path="/usuarios" element={<UsuarioList />} />
        <Route path="/usuarios/:id" element={<UsuarioDetail />} />
        <Route path="/usuarios/editar/:id" element={<UsuarioForm />} />
        <Route path="/equipes/novo" element={<EquipeForm />} />
        <Route path="/equipes" element={<EquipeList />} />
        <Route path="/equipes/:id" element={<EquipeDetail />} />
        <Route path="/equipes/editar/:id" element={<EquipeForm />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
