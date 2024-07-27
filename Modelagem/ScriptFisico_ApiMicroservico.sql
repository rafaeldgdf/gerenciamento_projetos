/* Lógico_ApiMicroservico: */

CREATE TABLE Equipe (
    Id_Equipe INTEGER PRIMARY KEY,
    Nome VARCHAR,
    Descricao VARCHAR,
    fk_Projetos_Id_Projeto INTEGER
);

CREATE TABLE Projetos (
    Id_Projeto INTEGER PRIMARY KEY,
    Nome VARCHAR,
    Descricao VARCHAR,
    Data_Inicio DATE,
    Data_Termino_Previsto DATE,
    Orcamento DOUBLE,
    Flags VARCHAR,
    Status VARCHAR,
    Id_Gerente INTEGER
);

CREATE TABLE Usuário (
    Id_Usuario INTEGER PRIMARY KEY,
    Matricula VARCHAR,
    Nome VARCHAR,
    Status BOOLEAN,
    Sobrenome VARCHAR
);

CREATE TABLE Pertence (
    fk_Equipe_Id_Equipe INTEGER,
    fk_Usuário_Id_Usuario INTEGER
);
 
ALTER TABLE Equipe ADD CONSTRAINT FK_Equipe_2
    FOREIGN KEY (fk_Projetos_Id_Projeto)
    REFERENCES Projetos (Id_Projeto)
    ON DELETE RESTRICT;
 
ALTER TABLE Projetos ADD CONSTRAINT FK_Projetos_2
    FOREIGN KEY (Id_Gerente???)
    REFERENCES ??? (???);
 
ALTER TABLE Usuário ADD CONSTRAINT FK_Usuário_2
    FOREIGN KEY (fk_Projetos_Id_Projeto)
    REFERENCES Projetos (Id_Projeto)
    ON DELETE RESTRICT;
 
ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_1
    FOREIGN KEY (fk_Equipe_Id_Equipe)
    REFERENCES Equipe (Id_Equipe)
    ON DELETE RESTRICT;
 
ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_2
    FOREIGN KEY (fk_Usuário_Id_Usuario)
    REFERENCES Usuário (Id_Usuario)
    ON DELETE RESTRICT;