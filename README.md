# Notes App API

## Overview

The Notes App API allows users to perform CRUD (Create, Read, Update, Delete) operations on notes. It also provides functionality for user account management, allowing users to create accounts and manage their notes.

[![technologies](https://skillicons.dev/icons?i=nodejs,js,express,prisma,postgresql,jest,git,github)](#backend)

## Table of Contents

- [Notes App API](#notes-app-api)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
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

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- Node.js and npm installed
- PostgreSql

### Installation

1. Clone the repository: `git clone https://github.com/MohamedAboElnaser/notes-app.git`
2. Install dependencies: `npm install`
3. Configure environment variables: Create a `.env` file .
   - Copy [.env.example](.env.example) content to `.env` file
   - Add values for environment variables
     > you can set `DATABASE_URL` , `TESTING_DB` and `PRODUCTION_DB` by the same connection string value like this format
     > postgresql://USER:PASSWORD@HOST:PORT/DATABASE
4. Migrate prisma schema to the db by running this command
   ```bash
       npm run migrateSchema
   ```
5. For testing , run this command
   ```bash
       npm test
   ```
6. For running app in `Development` environment , run this command
   ```bash
       npm run start
   ```
7. For running app in `Production` environment , run this command
   ```bash
       npm run start:prod
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
