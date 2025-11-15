# PayFlow API  
**Sistema de pagamentos em tempo real com TypeScript + Fastify + Supabase**

[![Render](https://img.shields.io/badge/Render-Deployed-brightgreen)](https://payflow-api.onrender.com)  
[![Node.js](https://img.shields.io/badge/Node.js-22-blue)](https://nodejs.org)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)  
[![Fastify](https://img.shields.io/badge/Fastify-4.28-green)](https://fastify.dev/)  
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)  
[![Docker](https://img.shields.io/badge/Docker-Deployed-blue)](https://docker.com)  

---

## O que é?

Uma **API de pagamentos** com **arquitetura modular por features**, pronta pra produção.  
Simula um sistema bancário com:

- Depositar  
- Sacar  
- Transferir  
- Consultar saldo  

> **Dinheiro em centavos** → precisão total (R$ 10,50 = 1050)  
> Conversão automática em reais no `GET /balance`

---

## Funcionalidades

. Registro & Login (JWT)
. Depósito
. Saque
. Transferência
. Saldo em reais
. Rate Limiting
. Documentação [Swagger](https://payflow-01fq.onrender.com/docs)
. Health Check (público + protegido)
. Testes com Jest + Supertest
. CI/CD com GitHub Actions

---

## Tech Stack

```text
    TypeScript + Fastify
    PostgreSQL (Supabase)
    Prisma ORM
    Zod (validação)
    JWT Auth
    Docker + Render
    Swagger Docs
    Rate Limit
    Jest + Supertest
    GitHub Actions (CI)
```
---

## Endpoints Principais

- POST   /auth/register -> Cadastra usuário

- POST   /auth/login -> Login com autenticação JWT

- POST   /transactions/deposit -> Depósito

- POST   /transactions/withdraw -> Saque

- POST   /transactions/transfer -> Transferência entre usuários

- GET   /user/balance -> Saldo em reais

- GET   /health  -> Health Check da api que retorna { status: ok }

- POST /health/test -> Health Check exclusivo pra testes com GitHub Actions que retorna { content: Hello World! }

---


## Deploy

- **Hospedado no Render**  
- **Containerizado com Docker**  
- **Zero downtime**  
- **Variáveis de ambiente seguras**

> **Nota:** No plano gratuito do Render, o primeiro request pode levar alguns segundos (cold start).  
