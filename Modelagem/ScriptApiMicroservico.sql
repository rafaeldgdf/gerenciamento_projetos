-- CREATE SCHEMA gerenciamento_projetos;
 CREATE TABLE usuario (
    id_usuario VARCHAR(36) PRIMARY KEY,
    matricula VARCHAR(50),
    nome VARCHAR(255),
    ultimo_nome VARCHAR(255),
    centro_de_custo VARCHAR(255),
    dt_nascimento DATE,
    inativo BOOLEAN,
    ativo BOOLEAN
);CREATE TABLE equipe (
    id_equipe VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(255),
    descricao TEXT
);CREATE TABLE projetos (
    id_projeto VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(255),
    dt_inicio DATE,
    dt_termino_prevista DATE,
    status VARCHAR(50),
    orcamento DECIMAL(10, 2),
    descricao TEXT,
    flags VARCHAR(50),
    gerente_responsavel VARCHAR(36),
    FOREIGN KEY (gerente_responsavel) REFERENCES usuario (id_usuario)
);CREATE TABLE pertence (
    id_equipe VARCHAR(36),
    id_usuario VARCHAR(36),
    PRIMARY KEY (id_equipe, id_usuario),
    FOREIGN KEY (id_equipe) REFERENCES equipe (id_equipe),
    FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);ALTER TABLE equipe
ADD idprojetos VARCHAR(36),
ADD FOREIGN KEY (idprojetos) REFERENCES projetos (id_projeto);ALTER TABLE usuario
ADD idprojetos VARCHAR(36),
ADD FOREIGN KEY (idprojetos) REFERENCES projetos (id_projeto);