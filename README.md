

# API - Autenticação de Usuários
  
</p>

## 📋 Sumário

- [Instalação](#-instalação)
	- [Requisitos](#requisitos)
	- [Instalando](#instalando)
- [Visão Geral](#-visão-geral)
	- [Requisitos](#requisitos)
	- [Requisitos Desejáveis](#requisitos-desejaveis)
	- [Requisitos Extras](#requisitos-extras)
	- [Modelagem](#modelagem)
		- [Arquitetura](#arquitetura)
		- [Deploy](#deploy)
- [Documentação](#documentação)
- [Tecnologias](#-tecnologias)

## 💻 Instalação

### Requisitos

- [Node.js](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/pt/), [NPM](https://www.npmjs.com/) ou semelhantes.

### Instalando

#### Clonando o projeto
```bash
# Clone o repositório
git clone 'http://https://github.com/iamthepoe/api-auth'
cd api-auth/

# Copie o arquivo
cp .env.example .env
```
#### Variáveis de Ambiente:
```bash
# URL de conexão com o MongoDB.
DATABASE_URL="URL"
# Porta na qual o servidor rodará.
SERVER_PORT="3000"
# Secret para os tokens JWT
JWT_SECRET="supersecreto"
```

#### Executando o Projeto
```bash
# Instale as dependências
pnpm install

# Inicie o projeto em modo de desenvolvimento
pnpm run dev
```
## 👀 Visão Geral

O presente repositório se trata de um **desafio técnico**, cujo a proposta é desenvolver uma **API RESTful** para autenticação de usuários, que permita operações de cadastro (sign up), autenticação (sign in) e recuperação de informações do usuário.

### Requisitos

 - [x] Persistência de dados: **MongoDB**.
 - [x] Sistema de build com gerenciamento de dependências: **Babel** + **PNPM**.
 - [x] Task runner para build: **Gulpjs**.
 - [x] Padronização de estilo: **ESLint** + **Prettier.**
 - [x] Framework: **Express**.

### Requisitos Desejáveis:
 - [x] JWT como Token.
 - [x] Testes Unitários.
 - [x] Criptografia hash na senha e token.
 
### Requisitos Extras:
 - [x] Testes de Ponta-a-Ponta (E2E).
 - [x] CI (Continuous Integration) com Github Actions.
 - [ ] Front-End:
	 - [ ] Tela de Login.
	 - [ ] Tela de Cadastro.
	 - [ ] Tela de Visualização de Perfil.
### Modelagem

#### Arquitetura
![desenho da arquitetura](https://raw.githubusercontent.com/iamthepoe/api-02/main/assets/arch.jpg)
1.  **Repository:**
    
    -   **Propósito:** A camada Repository (Repositório) é responsável por lidar diretamente com a persistência de dados. Sua função principal é abstrair e encapsular as operações relacionadas ao banco de dados ou a qualquer mecanismo de armazenamento. Ele fornece métodos para criar, ler, atualizar e excluir (CRUD) dados.
    -   **Exemplo:** Em uma aplicação Node.js com MongoDB, a camada Repository seria responsável por interagir diretamente com o MongoDB, executando operações como `insert`, `find`, `update`, `delete`, etc.
2.  **Service:**
    
    -   **Propósito:** A camada Service (Serviço) contém a lógica de negócios da aplicação. Ela representa a ponte entre o Controller e o Repository. As regras de negócios e operações mais complexas devem residir nesta camada. Isso facilita a reutilização da lógica de negócios em diferentes partes da aplicação e mantém o Controller focado em receber requisições e enviar respostas.
    -   **Exemplo:** Em um serviço de usuário, a camada Service poderia conter lógica para validar dados de entrada, aplicar regras de negócios específicas e interagir com o Repository para persistência.
3.  **Controller:**
    
    -   **Propósito:** A camada Controller (Controlador) é responsável por receber as requisições do cliente, chamar os métodos apropriados na camada de Service e retornar as respostas adequadas ao cliente. Ele lida com a comunicação entre a aplicação e o mundo exterior, frequentemente processando entradas do usuário, chamando os serviços necessários e formatando as respostas.
    -   **Exemplo:** Em um controller de autenticação, a camada Controller receberia uma solicitação de login, chamaria o serviço de autenticação para validar as credenciais e retornaria uma resposta adequada ao cliente.
#### Deploy 
![deploy](https://raw.githubusercontent.com/iamthepoe/api-02/main/assets/deploy.png)

## Documentação

### POST /sign-up
#### Input:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phones": [
    {
      "ddd": "string",
      "number": "string"
    }
  ]
}
```
#### Output (sucesso):

**Status**: 201 (Created).
**Body**:
```json
  "id": "UUID",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date",
  "token": 	"JWT-TOKEN"
```

#### Output (email já cadastrado):
**Status**: 400 (Bad Request).
**Body**:
```json
{
  "message": "Email is already in use"
}
```

### POST /sign-in

#### Input:
```json
{
  "email": "string",
  "password": "string",
}
```

#### Output (sucesso):

**Status**: 200 (OK).
**Body**:
```json
  "id": "UUID",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date",
  "token": 	"JWT-TOKEN"
```

#### Output (senha e/ou email incorretos):

**Status**: 401 (Unauthorized).
**Body**:
```json
{
  "message": "Email or/and password are incorrect."
}
```
### GET /user
#### Header
```json
"Authorization": "Bearer your_access_token"
```
#### Output (sucesso):

**Status**: 200 (OK).
**Body**:
```json
{
  "id": "UUID",
  "name": "string",
  "email": "string",
  "phones": [
    {
      "number": "string",
      "ddd": "string",
      "_id": "UUID"
    }
  ]
}
```

#### Output (token inválido ou expirado):

**Status**: 401 (Unauthorized).
**Body**: 
```json
{
  "message": "Unauthorizated."
}
```
## 🚀 Tecnologias

As principais tecnologias utilizadas foram:

- [Node.js](https://nodejs.org/en/)
- [JSDoc](https://jsdoc.app/)
- [Express](https://expressjs.com/pt-br/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)

<hr>
<div align=center>Feito por Luca Poe.</div>
