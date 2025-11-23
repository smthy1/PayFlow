# PayFlow API  
**Sistema de pagamentos em tempo real com TypeScript + Fastify + Supabase**

[![Render](https://img.shields.io/badge/Render-Deployed-brightgreen)](https://payflow-api.onrender.com)  
[![Node.js](https://img.shields.io/badge/Node.js-22-blue)](https://nodejs.org)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)  
[![Fastify](https://img.shields.io/badge/Fastify-5.6-green)](https://fastify.dev/)  
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)  
[![Docker](https://img.shields.io/badge/Docker-Deployed-blue)](https://docker.com)  



## Visão Geral

O PayFlow é uma **API de simulação de pagamentos** com **arquitetura modular por features**, autenticação JWT, cache interno e operações com precisão. 

# Funcionalidades

## Autenticação e segurança

- Registro e Login (JWT)
- Recuperação de senha com envio de e-mail
- Rate Limiting
- Rotas públicas e protegidas
- Conversão financeira em centavos (anti-floating point)

## Performance e resiliência

- Cache em memória com TTL
- UptimeRobot para manter a API acordada e evitar cold start do Render
- Rota de Health Check

## Operações bancárias

- Depósito
- Saque
- Transferência entre usuários
- Consulta de saldo

> **Dinheiro em centavos** → precisão total (R$ 10,50 = 1050)  
> Conversão automática em reais no `GET /user/balance`


## Documentação

- Documentado com [Swagger](https://payflow-01fq.onrender.com/docs)


## Tech Stack

```text
    TypeScript + Fastify
    PostgreSQL (Supabase)
    Prisma ORM
    Zod (validação)
    JWT Auth
    Rate Limit
    Cache interno com TTL
    Docker + Render
    Swagger Docs
    Jest + Supertest
    GitHub Actions (CI)
    Resend (emails)
```

## Endpoints Principais

```text
    POST   /auth/register -> Cadastra usuário
    POST   /auth/login -> Login JWT
    POST   /auth/forgot-password -> Envio de email para o reset de senha
    PATCH   /auth/reset-password -> Redefine senha

    POST   /transactions/deposit -> Depósito
    POST   /transactions/withdraw -> Saque
    POST   /transactions/transfer -> Transferência

    GET   /user/balance -> Saldo em reais
```

## Deploy

- **Hospedado no Render** (Free Tier)  
- **Containerizado com Docker**  
- **Variáveis de ambiente seguras**

> **Nota sobre Cold Start:**  
> No Render Free, a API "dorme" após **15 minutos** de inatividade → primeiro request poderia levar mais de **50 segundos**.
>  
> **Solução implementada:**  
> **UptimeRobot** faz ping no endpoint `/health` a **cada 14 minutos** → mantém a API **sempre aquecida**.  
>
> **Resultado:** Primeiro acesso em **< 800ms**, mesmo após horas parado.