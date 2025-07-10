<h1 align="center" style="color: white">

[Comandas API](https://comandas-api.vercel.app/docs/)

</h1>

> RESTful API for the React Native application - Comandas. With JWT user authentication, swagger docs, developed with NodeJS, TypeScript, Express, and Jest tests. Clean architecture and TDD.

## 🧠 Project Description

RESTful API developed with Node.js, TypeScript, Express, MySQL, DrizzleORM, and Jest tests. It includes user authentication using JSON Web Tokens (JWT), Swagger documentation for easy API exploration, and follows a structure based on Clean Architecture and Test-Driven Development (TDD). This project aims to provide a robust and scalable backend for the [Comandas](https://github.com/alvarosoaress/Comandas/tree/main) project applications.

## 💻 Technologies

![TypeScript](https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge\&logo=typescript\&logoColor=007ACC)
![TsNode](https://img.shields.io/badge/ts--node-20232A?style=for-the-badge\&logo=ts-node\&logoColor=3178C6)
![ExpressJs](https://img.shields.io/badge/Express%20js-20232A?style=for-the-badge\&logo=express\&logoColor=white)
![MySql](https://img.shields.io/badge/MySQL-20232A?style=for-the-badge\&logo=mysql\&logoColor=005C84)
![NodeJs](https://img.shields.io/badge/Node%20js-20232A?style=for-the-badge\&logo=nodedotjs\&logoColor=339933)
![Swagger](https://img.shields.io/badge/Swagger-20232A?style=for-the-badge\&logo=Swagger\&logoColor=85EA2D)
![JWT](https://img.shields.io/badge/JWT-20232A?style=for-the-badge\&logo=JSON%20web%20tokens\&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-20232A?style=for-the-badge\&logo=jest\&logoColor=C21325)
![Drizzle](https://img.shields.io/badge/Drizzle%20ORM-20232A?style=for-the-badge\&logo=drizzle\&logoColor=339933)

## ✨ Features

* `User authentication`: Secure user authentication using JSON Web Tokens (JWT), with encrypted refresh tokens stored in the database.

* `Synchronous changes`: The API automatically handles cascading changes that impact other database information. For example, when a new establishment review is submitted, the overall rating is automatically updated.

* `Multi-app API`: The API was developed with the intention of supporting two distinct applications that share some information.

* `Route protection`: All routes that perform user data operations require a JWT token in the request and include protection based on permission levels and user types. For example, a user with a token signed as type "customer" cannot perform any operation on routes requiring type "shop".

* `Swagger documentation`: The entire API is fully [documented](https://comandas-api.vercel.app/docs/) using the Swagger library, including all endpoints and their request/response schemas.

* `And much more!`: Dive into the documentation to discover all the fine details that don’t fit here!

## 🚀 Running

* <kbd>1</kbd> First of all, you need to clone the repository. Inside the root, you’ll see two files, `ExampleTestEnv` and `ExampleEnv`. You need to open and edit them according to the instructions inside the files.

* <kbd>2</kbd> Now you need to install the project dependencies,

> use your preferred package manager.

```sh
yarn install
```

* <kbd>3</kbd> Then you need to migrate the database structure

```sh
yarn migrate
```

* <kbd>4</kbd> Done! You can now start the server and read the documentation!

```sh
yarn dev
```

> Output:
>
> > Docs available at [http://localhost:8000/docs](http://localhost:8000/docs)
> > Server is running fine! [http://localhost:8000/](http://localhost:8000/)

## 🔧 Running tests

This project includes tests developed using Jest. They were created to ensure that the code still works and business rules remain consistent after changes.

Each API module includes unit tests, which test logic and business rules, and integration tests, which verify code integration with the database.

Integration tests create temporary schemas within your MySQL for each API module. The schemas are automatically destroyed at the end of each test.

* <kbd>1</kbd> Make sure there is a properly filled `.test.env` file in the root of the project.

* <kbd>2</kbd> Run all tests

> use your preferred package manager.

```sh
yarn migrate
```

### 🚧 Possible issues

* At the end of the tests, Jest may not terminate automatically. I tried hard to solve this "open connection" issue but couldn't. To terminate the process, just run <kbd>CTRL</kbd>+<kbd>C</kbd> in the terminal running the tests.

* When running the tests, it automatically checks if a migration has already been done. If not, the migration is created.

* Check the `database/migrations` folder and make sure there is only one `.sql` file inside. If there is more than one, temporarily move the `migrations` folder out of `database` and run the tests again.

---

<!--
Comandas API
2
https://comandas-api.vercel.app/docs/
TypeScript;TsNode;Express;MySQL;Node.JS;Swagger;JsonWebTokens;Jest;Drizzle

RESTful API developed with Node.js, TypeScript, Express, MySQL, DrizzleORM, and Jest tests. It includes user authentication using JSON Web Tokens (JWT), Swagger documentation for easy API exploration, and follows a structure based on Clean Architecture and Test-Driven Development (TDD). This project aims to provide a robust and scalable backend for the Comandas project applications.
available
-->
