# Notes App API

## Overview

The Notes App API allows users to perform CRUD (Create, Read, Update, Delete) operations on notes. It also provides functionality for user account management, allowing users to create accounts and manage their notes.

[![technologies](https://skillicons.dev/icons?i=nodejs,js,express,prisma,postgresql,jest,git,github,docker,yarn)](#backend)

## Table of Contents

- [Notes App API](#notes-app-api)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [UML for DB](#uml-for-db)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Endpoints](#endpoints)
  - [Technology Stack](#technology-stack)
      - [Backend](#backend)
      - [Authentication](#authentication)
      - [Email Services](#email-services)
      - [Testing](#testing)
      - [Documentation](#documentation)
      - [Deployment](#deployment)
      - [Version Control](#version-control)
  - [How to Contribute](#how-to-contribute)

## Architecture

![app-architecture](docs/appArch.svg)

## UML for DB

![uml](docs/Database_UML.jpg)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- Docker installed on your machine

### Installation

1.  Clone the repository: `git clone https://github.com/MohamedAboElnaser/notes-app.git`
2.  Configure environment variables: Create a `.env` file .
    - Copy [.env.example](.env.example) content to `.env` file
    - Set DATABASE_URL to
      `  
          DATABASE_URL=postgresql://postgres:postgres@db:5432/notes-app
        `       
3. Run the following command to start the project
   ```bash
        docker-compose up
    ```

## Endpoints

You can see postman documentation from [here](https://documenter.getpostman.com/view/30739769/2s9YeBeZR2)

## Technology Stack

The Notes App API leverages the following technologies and tools:

#### Backend

- **Node.js:** The server-side runtime environment for executing JavaScript code.
- **Express.js:** A minimal and flexible Node.js web application framework for building robust APIs.
- **PostgreSQL:** A powerful open-source relational database used for storing user accounts and notes.
- **Prisma:** A modern database toolkit and ORM for Node.js and TypeScript.

#### Authentication

- **JWT (JSON Web Tokens):** Used for secure user authentication.

#### Email Services

- **Mailtrap (Development):** A service for email testing during development. SMTP credentials can be configured in the `.env` file.
- **SendinBlue (Production):** A cloud-based email marketing platform. Configure production email settings in the `.env` file.

#### Testing

- **Jest:** A delightful JavaScript testing framework for Node.js applications.
- **Supertest:** A library for testing HTTP assertions.

#### Documentation

- **Postman:** Used to provide a collection for API exploration.

#### Deployment

- **Render:** A cloud platform for hosting and deploying web applications.

#### Version Control

- **Git:** A distributed version control system.
- **GitHub:** A web-based platform for version control and collaboration.

## How to Contribute

If you'd like to contribute to the project or have suggestions for improvement, please do not hesitate to make pull request
