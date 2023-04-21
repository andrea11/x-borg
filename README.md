# X-Borg Task

- [Tech Challenge: Implementing Authentication Flow with Metamask, PostgreSQL, and Front-End](#tech-challenge--implementing-authentication-flow-with-metamask--postgresql--and-front-end)
    + [Objective](#objective-)
    + [Requirements](#requirements-)
    + [Instructions](#instructions-)
    + [Technical Details](#technical-details-)
    + [Evaluation Criteria](#evaluation-criteria-)
        * [Relevant documentation](#relevant-documentation-)
- [Solution description](#solution-description)
    + [Architecture](#architecture)
        * [Contracts](#contracts)
        * [Database](#database)
        * [Frontend](#frontend)
        * [Backend](#backend)
            + [Authentication flow](#authentication-flow)
            + [User details flow](#user-details-flow)
    + [Getting started](#getting-started)
        * [General](#general)
            + [Testing](#testing)
        * [Docker](#docker)
        * [Local development](#local-development)
            + [Backend](#backend-1)
                * [Testing](#testing-1)
            + [Frontend](#frontend-1)
                * [Testing](#testing-2)
- [Demo](#demo)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with
          markdown-toc</a></i></small>

## Tech Challenge: Implementing Authentication Flow with Metamask, PostgreSQL, and Front-End

### Objective:

To build an authentication flow that allows a user to authenticate with their Metamask wallet and store the user's
details in a PostgreSQL database using wallet signature.

#### Requirements:

Knowledge of Metamask, PostgreSQL, and front-end technologies (HTML, CSS, and JavaScript)
Experience with backend development and RESTful APIs

#### Instructions:

Build a backend RESTful API that supports two endpoints: POST /auth and GET /user.
The POST /auth endpoint should accept a wallet signature from Metamask and authenticate the user.
After authentication, store the user's details (e.g., public address) in a PostgreSQL database.
The GET /user endpoint should return the user's details from the database.
Build a front-end interface that allows the user to initiate the authentication process and display the user's details
after authentication.

#### Technical Details:

Use Metamask to sign messages for authentication. You can use the web3 library to interact with Metamask.
Use a PostgreSQL database to store the user's details (e.g., public address).
The backend should be built using Node.js
The front-end interface can be built using HTM and JavaScript or any front-end framework of your choice (Ideally
React.js/Next.js).

##### Evaluation Criteria:

- Functionality: Does the application meet the requirements outlined above?
- Code Quality: Is the code well-organized, readable, and maintainable?
- Security: Does the application implement security best practices for handling user authentication and storing
  sensitive user data?

##### Relevant documentation:

- https://docs.metamask.io/guide/
- https://docs.walletconnect.com/2.0

## Solution description

### Architecture

#### Contracts

I used contracts (defined thanks to ts-rest), to define the API of the backend.
It makes it easy to handle request and response both on the backend and frontend.
Furthermore, it provides typescript types support.

#### Database

I used PostgreSQL via NeonDB. I chose NeonDB because it is a cloud
hosted PostgreSQL database that is easy to setup and use. It also has a free tier
that is perfect for this project.

#### Frontend

Next.js is used for the frontend. Next.js is a React framework that makes it easy to
create server-side rendered React applications. It also has built in support for
serverless functions which is perfect for this project. The frontend is responsible
for handling the user's interaction with the application. It uses Web3 to sign
messages and send them to the backend for validation. It also uses prisma to
fetch the user's details from the database.

#### Backend

Because the requirement were not clear about the possibility to use a serverless function as a backend, I decided to
implement two backends.
The first backend is a serverless function provided by NextJS. It can work with Vercel, and it can be deployed on every
commit.
The second backend is a Node.js express server.
Both backends are responsible for handling the authentication flow and storing the user's details in the database.
It uses Web3 to validate the signature sent by the user and stores the user's details in the database using prisma.
(See the [Getting started](#Getting started) section for more details)

#### Authentication flow

The authentication flow is the following:

1. The user clicks on the "Login" button
2. The frontend shares the same hardcoded message with the backend (ideally this should be generated on the fly). 
   It sends a POST request to the /auth backend endpoint with the signature of the message
3. The backend validates the signature and stores the user id in the database
4. The backend reply with an empty response, and with a cookie setting up the auth token to the frontend

#### User details flow
1. Once the user is authenticated, the frontend automatically fetch the user's details by sending a GET request to the /user backend
   endpoint.
2. The backend fetches the user's details from the database and replies with the user's details
3. The frontend displays the user's details

### Getting started

#### General

1. Install dependencies

```bash 
npm install
```

2. Create a .env file (using the .env.example as template) in the root directory. You can opt for 2 values for
   the `NEXT_PUBLIC_API_URL_ENTRYPOINT` environment variables:

```bash
NEXT_PUBLIC_API_URL_ENTRYPOINT="http://localhost:3000/api" # -> for the serverless backend
# or
NEXT_PUBLIC_API_URL_ENTRYPOINT="http://localhost:8000/api" # -> for the express backend
```

##### Testing

You can run the tests using the following command:

```bash
npm run test
```

#### Docker

You can use docker to run the project. 
It will run the express node backend, the frontend/serverless function, and the DB in 3 different containers.
You can still use the `NEXT_PUBLIC_API_URL_ENTRYPOINT` environment variable to choose which backend to use.
You can use the following command to start the project:

```bash
docker-compose up -d
```

#### Local development

Follow the instructions below to run the project locally.

##### Backend

1. Run the backend

```bash
npm run build:server && npm run start:server
```

###### Testing

You can run the tests using the following command:

```bash
npm run test:server
```

##### Frontend

1. Run the frontend

```bash
npm run build:ui && npm run start:ui
```

###### Testing

You can run the tests using the following command:

```bash
npm run test:ui
```

## Demo
For a demo, please visit https://x-borg.vercel.app/