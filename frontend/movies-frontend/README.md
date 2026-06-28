# Desafio Técnico - Front-end

Aplicação front-end desenvolvida em Angular para consulta dos indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards

## Tecnologias utilizadas

- Angular 21
- TypeScript
- HTML
- CSS
- Jasmine/Karma

## Funcionalidades

A aplicação possui duas páginas:

- Dashboard
- Lista de todos os filmes

### Dashboard

O dashboard apresenta quatro painéis:

- Anos que tiveram mais de um vencedor
- Top 3 estúdios com mais vitórias
- Produtores com maior e menor intervalo entre vitórias
- Busca de vencedores por ano

### Lista de filmes

A tela de listagem apresenta:

- Paginação
- Filtro por ano
- Filtro por vencedor

## API utilizada

A aplicação consome a API pública disponibilizada pela Outsera:

```txt
https://challenge.outsera.tech/api/movies
```

## Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```bash
cd <nome-do-projeto>
```

Instale as dependências:

```bash
npm install
```

## Como executar

Execute o projeto com:

```bash
ng serve
```

Acesse no navegador:

```txt
http://localhost:4200
```

## Como executar os testes

```bash
ng test
```

## Estrutura principal

```txt
src/app
├── models
├── pages
│   ├── dashboard
│   └── movie-list
├── services
├── app.config.ts
├── app.routes.ts
└── app.ts
```

