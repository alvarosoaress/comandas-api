<h1 align="center" style="color: white">
    
[Comandas API](https://comandas-api.vercel.app/docs/)

</h1>

> API RESTFul para o aplicativo React Native - Comandas. Com autenticação de usuário JWT, swagger docs, desenvolvida com NodeJS, TypeScript, Express e com testes Jest. Arquitetura Clean architecture TDD.

## 🧠 Descrição do Projeto

API RESTful desenvolvida com Node.js, TypeScript, Express, MySQL, DrizzleORM e com testes Jest. Ela inclui autenticação de usuário usando JSON Web Tokens (JWT), documentação Swagger para uma exploração fácil da API e segue uma estrutura baseada no Clean Architecture e desenvolvimento orientado a testes (TDD). Este projeto visa fornecer um backend robusto e escalável para os aplicativos do projeto [Comandas](https://github.com/alvarosoaress/Comandas/tree/main).

## 💻 Tecnologias

![TypeScript](https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=007ACC)
![TsNode](https://img.shields.io/badge/ts--node-20232A?style=for-the-badge&logo=ts-node&logoColor=3178C6)
![ExpressJs](https://img.shields.io/badge/Express%20js-20232A?style=for-the-badge&logo=express&logoColor=white)
![MySql](https://img.shields.io/badge/MySQL-20232A?style=for-the-badge&logo=mysql&logoColor=005C84)
![NodeJs](https://img.shields.io/badge/Node%20js-20232A?style=for-the-badge&logo=nodedotjs&logoColor=339933)
![Swagger](https://img.shields.io/badge/Swagger-20232A?style=for-the-badge&logo=Swagger&logoColor=85EA2D)
![Jest](https://img.shields.io/badge/JWT-20232A?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-20232A?style=for-the-badge&logo=jest&logoColor=C21325)
![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-20232A?style=for-the-badge&logo=drizzle&logoColor=339933)

## ✨ Funcionalidades

- `Autenticação de usuários`: Autenticação segura de usuário usando JSON Web Tokens (JWT), com refresh token criptografado no banco de dados.

- `Mudanças síncronas`: API lida automáticamente com mudanças em cascata que impactam outras informações do banco de dados, por exemplo, quando uma nova avaliação de estabelecimento é submetida, a nota do lugar automaticamente se ajusta a ela.

- `API multi aplicativos`: A API foi desenvolvida sendo pensada para funcionar em dois aplicativos distintos que compartilham algumas infomações entre si.

- `Proteção de rotas`: Todas rotas que realizam operações de dados de usuário necessitam de um token JWT em sua requisição e ainda contam com proteção baseada em nível de permissão e tipo de usuário, por exemplo, um usuário que tenha seu token JWT assinado como tipo "customer" não pode realizar qualquer tipo de operação em rotas que necessitam o tipo "shop".

- `Documentação Swagger`: Toda a API é totalmente [documentada](https://comandas-api.vercel.app/docs/) usando a biblioteca Swagger, incluindo todos seus endpoints e seus schemas de requisição e de resposta.

- `E muito mais!`: Se aventure na documentação para descobrir todos mínimos detalhes que não cabem aqui !

## 🚀 Executando

- <kbd>1</kbd> Primeiro de tudo, é necessário clonar o repositório, dentro da raiz você verá dois arquivos, `ExampleTestEnv` e `ExampleEnv`, é necessário abrir e edita-los de acordo com as instruções contidas nos próprios arquivos

- <kbd>2</kbd> Agora é necessário instalar as dependências do projeto,

> use seu gerenciador de pacotes de preferência.

```sh
yarn install
```

- <kbd>3</kbd> Logo após é preciso realizar o migrate da estrutura do Banco de Dados

```sh
yarn migrate
```

- <kbd>4</kbd> Pronto! Agora já é possível iniciar o servidor e ler a documentação !

```sh
yarn dev
```

> Saída:
>> Docs available at <http://localhost:8000/docs>
>> Server is running fine! <http://localhost:8000/>

## 🔧 Rodando testes

Esse projeto conta com testes desenvolvidos usando Jest. Eles foram criados para certificar que o código ainda funciona e a regra de negócio ainda está de acordo após alterações.

Cada module da API conta com testes de serviço, quais testam a lógica e regra de negócio, e de integração, quais testam a integração do código com o banco de dados.

Os testes de integração criam schemas temporários dentro do seu MySQL para cada module da API, os schemas são automaticamente destruídos ao fim de cada teste.

- <kbd>1</kbd> Tenha certeza de que existe um `.test.env` preenchido corretamente na raíz do projeto.

- <kbd>2</kbd> Rode todos os testes

> use seu gerenciador de pacotes de preferência.

```sh
yarn migrate
```

### 🚧 Possíveis problemas

- Ao final dos testes, pode ser que o Jest não termine automáticamente, tentei muito resolver esse problema de "conexão aberta", porém, não consegui. Para terminar o processo basta executar um <kbd>CTRL</kbd>+<kbd>C</kbd> no terminal que está rodando os testes.

- Quando executado os testes, é automaticamente checado se existe alguma migration já realizada, se não houver, a migration é criada.

- Verifique a pasta `database/migrations` e veja se há apenas um .sql dentro dela, caso exista mais de um, mova temporariamente a pasta `migrations` para fora de `database` e rode os testes novamente.
