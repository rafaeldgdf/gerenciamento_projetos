import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import ProjetoPage from './pages/ProjetoPage';
import ProjetoDetail from './components/ProjetoDetail';
import ProjetoForm from './components/ProjetoForm';
import NavBar from './components/NavBar';
import UsuarioList from './components/usuario/UsuarioList';
import EquipeList from './components/equipe/EquipeList';
import UsuarioForm from './components/usuario/UsuarioForm';
import EquipeForm from './components/equipe/EquipeForm';

const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/projetos" exact component={ProjetoPage} />
          <Route path="/projetos/:id" exact component={ProjetoDetail} />
          <Route path="/projetos/editar/:id" component={ProjetoForm} />
          <Route path="/projetos/novo" component={ProjetoForm} />
          <Route path="/usuarios" exact component={UsuarioList} />
          <Route path="/usuarios/novo" component={UsuarioForm} />
          <Route path="/usuarios/:id" component={UsuarioForm} />
          <Route path="/equipes" exact component={EquipeList} />
          <Route path="/equipes/novo" component={EquipeForm} />
          <Route path="/equipes/:id" component={EquipeForm} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
