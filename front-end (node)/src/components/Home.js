import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo(a) ao Gerenciador de Projetos</h1>
      <div className="home-content">
        <section>
          <h2>Visão Geral</h2>
          <p>
            Esta aplicação foi desenvolvida para facilitar o gerenciamento de projetos, equipes e usuários. 
            Aqui, você poderá cadastrar, editar e visualizar informações detalhadas sobre os projetos em andamento, 
            as equipes envolvidas e os usuários que fazem parte da sua organização.
          </p>
        </section>

        <section>
          <h2>Funcionalidades</h2>
          <ul>
            <li><strong>Gestão de Projetos:</strong> Crie novos projetos, atualize informações e acompanhe o status e o progresso de cada um.</li>
            <li><strong>Gestão de Equipes:</strong> Organize suas equipes, atribua membros e gerentes, e mantenha um controle eficiente sobre as atividades de cada equipe.</li>
            <li><strong>Gestão de Usuários:</strong> Adicione novos usuários, gerencie suas informações e controle seu status (ativo/inativo) dentro da aplicação.</li>
          </ul>
        </section>

        <section>
          <h2>Como Usar</h2>
          <ol>
            <li><strong>Navegação:</strong> Utilize o menu de navegação no topo da página para acessar as seções de Usuários, Equipes e Projetos.</li>
            <li><strong>Cadastro:</strong> Para adicionar novos dados, utilize os botões de "Novo Usuário", "Nova Equipe" e "Novo Projeto".</li>
            <li><strong>Edição:</strong> Em cada lista, clique no botão "Editar" ao lado do item que deseja modificar.</li>
            <li><strong>Visualização:</strong> Clique no botão "Abrir" para visualizar os detalhes de um usuário, equipe ou projeto específico.</li>
            <li><strong>Busca:</strong> Utilize a barra de busca disponível em cada seção para encontrar rapidamente o que procura.</li>
          </ol>
        </section>

        <section>
          <h2>Exemplos de Uso</h2>
          <p><strong>Gerenciamento de Projetos:</strong> Suponha que você precise gerenciar um novo projeto de desenvolvimento de software. Acesse a seção de Projetos, clique em "Novo Projeto", preencha os detalhes necessários como nome, centro de custo, datas e equipe envolvida. Após salvar, você pode acompanhar o progresso e atualizar o status conforme o projeto avança.</p>
          <p><strong>Organização de Equipes:</strong> Para organizar suas equipes, vá até a seção de Equipes e clique em "Nova Equipe". Adicione os membros selecionando-os da lista de usuários disponíveis e atribua um gerente. Isso permitirá um controle eficiente sobre as atividades da equipe.</p>
          <p><strong>Gestão de Usuários:</strong> Na seção de Usuários, você pode adicionar novos membros à organização clicando em "Novo Usuário". Insira as informações pessoais e profissionais, e defina o status do usuário (ativo/inativo). Isso garante que apenas usuários autorizados tenham acesso às funcionalidades da aplicação.</p>
        </section>

        <section>
          <h2>FAQs</h2>
          <ul>
            <li><strong>Como adiciono um novo usuário?</strong> Vá até a seção de Usuários e clique em "Novo Usuário". Preencha o formulário com as informações necessárias e clique em "Salvar".</li>
            <li><strong>Como edito um projeto existente?</strong> Na seção de Projetos, encontre o projeto que deseja editar e clique no botão "Editar" ao lado do projeto. Faça as alterações necessárias e salve.</li>
            <li><strong>Posso remover um membro de uma equipe?</strong> Sim, vá até a seção de Equipes, edite a equipe desejada e desmarque os membros que deseja remover.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
