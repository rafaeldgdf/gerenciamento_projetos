SELECT * from usuarios;
SELECT * from equipes;
SELECT * from projetos;
SELECT * from equipe_usuarios;

-- usuários e suas equipes
SELECT 
    e.nome AS equipe_nome,
    e.descricao AS equipe_descricao,
    u.nome AS usuario_nome,
    u.ultimo_nome AS usuario_sobrenome,
    u.email AS usuario_email,
    u.matricula AS usuario_matricula,
    u.centro_custo AS usuario_centro_custo,
    u.status_usuario AS usuario_status
FROM 
    equipe_usuarios eu
JOIN 
    usuarios u ON eu.usuario_id = u.id_usuario
JOIN 
    equipes e ON eu.equipe_id = e.id_equipe
ORDER BY 
    e.nome, u.nome
LIMIT 0, 400;

-- para listar equipe e seus respectivos projetos
SELECT 
	e.id_equipe AS "ID Equipe",
    e.nome AS "Nome Equipe",
	p.matricula AS "Matrícula Projeto",
    p.nome AS "Nome do Projeto",
    p.descricao AS "Descrição",
    p.orcamento as "Orçamento",
    p.status_projeto AS "Status"
FROM 
    equipes e
JOIN 
    projetos p ON e.id_equipe = p.id_equipe
ORDER BY 
    e.id_equipe, p.id_projeto;
    
    
-- para listar usuarios e suas equipes 
SELECT 
    e.nome AS "Nome da equipe"
FROM 
    usuarios u
JOIN 
    equipe_usuarios eu ON u.id_usuario = eu.usuario_id
JOIN 
    equipes e ON eu.equipe_id = e.id_equipe
ORDER BY 
    u.id_usuario, e.id_equipe;




