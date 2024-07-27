# API-microservico

## Contexto
Considerando a migração de um sistema monolito, que permite o acompanhamento detalhado de projetos sendo executados na linha de inovação do cliente, para uma arquitetura de microserviço, extrair (criar) o [micro]serviço que gerencia a criação e manutenção de novos projetos para que possa ser a fonte da verdade em relação a essa informação dentro da instituição e permita prover uma API que será utilizada por outros sistemas dentro do ecossistema digital da empresa.

## Objetivo 
Implementar o microserviço descrito acima com o intuito de que seja a fonte da verdade para os dados de projetos dentro da organização. O microserviço deve considerar as seguintes características:
- Um projeto deve possuir os seguintes dados: identificador único (pode ser sequencial ou um UUID), nome do projeto, centro de custo do projeto, gerente responsável pelo projeto (aqui pode ser uma referência a uma entidade usuário), data de início e data de término do projeto, status (e.g., iniciado, on-hold, finalizado, outros), flag (e.g., vermelho, amarelo, verde => indicando como o projeto está em relação ao acompanhamento)
- a entidade usuário é básica e precisa estar no modelo de dados do sistema. Para todos os efeitos, um usuário pode conter, pelo menos, id único, o primeiro nome, último nome, um número de matrícula da organização e se está ativo ou não. Mas podem acrescentar outros dados, tais como data de nascimento e/ou centro de custo ao qual está associado.
- Prover uma API que será consumida por outros microserviços que precisem das informações de projeto dentro da organização. As seguintes URLs podem ser providas (não precisa limitar ao que está aqui):
- GET http://<servidor>/projects; retornar a lista de projetos cadastrados no banco de dados; OPCIONAL: incluir filtros por certas entidades mencionadas acima
- POST http://<servidor>/projects; adicionar um novo projeto ao banco de dados.
- PUT http://<servidor>/projects/<id>; editar projeto existente no banco de dados.
- GET http://<servidor>/projects/<id>; retornar um projeto em específico.
- GET http://<servidor>/users; retornar a lista de usuários do sistema
- POST http://<servidor>/users; adicionar um novo usuário ao banco de dados.

## Comentários
Pode-se usar ferramentas como o Postman para testar a API construída
Caso haja tempo e tarefas possam ser paralelizadas, outras coisas podem ser feitas para incrementar o desafio. Como, por exemplo:
- Criação de uma UI (pode ser em React, Vue, Angular, etc)
- Criar containers docker para rodar o servidor, banco de dados e UI
- Gerar uma autenticação ao sistema usando JWT

## Docker e Docker-Compose
### Banco de Dados
O banco de dados está configurado via Docker Compose
```
db:
    image: mysql:latest
    container_name: projeto-m3-db
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: gerenciamento_projeto
    volumes:
      - <your-local-path>:/var/lib/mysql
```

Ao rodar no ambiente local, recomendo modificar o valor de MYSQL_ROOT_PASSWORD para uma senha forte à sua escolha. Modificar o mapeamento das portas, nome do container e o nome do banco de dados é por sua escolha. O volume está configurado para que seja possível persistir os dados do mysql caso o container seja removido.

Para subir o container do mysql:
- Modificar no docker-compose.yml o "<your-local-path"> para uma pasta do seu computador à sua escolha
- no terminal: `docker compose up db -d`

### Spring Boot App
Configuração do backend via docker compose
```
 backend:
    build: .
    ports:
      - "8080:8080"
    container_name: projeto-m3-backend
```

Para subir o container:
- no terminal (a partir da pasta base do projeto): `cd projeto-m3 && ./mvnw package && java -jar target/projeto-m3.jar`
- no terminal: `docker compose build backend`
- no terminal: `docker compose up backend -d`

### Alterações no application.properties
Foi necessário alterar alguns pontos do application.properties. 
- Por alguma razão, o container do spring boot só funciona adicionando essa linha: `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect`
- Em spring.datasource.url, substituir localhost por 172.17.0.1. Como a aplicação Java agora está containerizada, o localhost aponta para o localhost do container. Para acessar o container do Banco de Dados, use o ip 172.17.0.1, que é o IP padrão da sua máquina host na rede interna criada pelo Docker. Desse modo, o container Java vai acessar a máquina host na porta 3306. Essa porta foi mapeada pelo container Mysql, então o tráfego é redirecionado para o container Mysql. Desse modo, a sua máquina host age como uma ponte entre os containers. É possível configurar a rede do Docker para acessar diretamente o container, mas para simplificar as coisas, use o IP fornecido 172.17.0.1.  