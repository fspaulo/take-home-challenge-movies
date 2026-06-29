# take-home-challenge-movies

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
cd frontend/movies-frontend/
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

===============================================================================

# Desafio técnico - Back-end

API RESTful desenvolvida em Spring Boot para leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

## Tecnologias utilizadas

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database
- Maven
- JUnit
- MockMvc

## Objetivo

A aplicação lê um arquivo CSV ao iniciar, salva os dados em um banco H2 em memória e disponibiliza um endpoint para consultar os produtores com:

- Menor intervalo entre duas vitórias consecutivas
- Maior intervalo entre duas vitórias consecutivas

## CSV

O arquivo CSV deve estar localizado em:

```txt
src/main/resources/movielist.csv
```

Formato esperado:

```csv
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions;Jerry Weintraub;
```

O campo `winner` deve conter `yes` para filmes vencedores. Quando estiver vazio, o filme será considerado não vencedor.

## Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```bash
cd backend/movies-backend/
```

Instale as dependências:

```bash
mvn install
```

## Como executar

Execute a aplicação com:

```bash
mvn clean spring-boot:run
```

A aplicação será iniciada em:

```txt
http://localhost:8080
```

## Endpoint

### Consultar intervalos de vitórias por produtor

```http
GET /producers/award-intervals
```

Exemplo de resposta:

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```

## H2 Console

Com a aplicação rodando, acesse:

```txt
http://localhost:8080/h2-console
```

Utilize as seguintes configurações:

```txt
JDBC URL: jdbc:h2:mem:awardsdb
User Name: sa
Password:
```

A senha deve ficar vazia.

## Como executar os testes

```bash
mvn test
```

## Estrutura principal

```txt
src/main/java
├── controller
├── dto
├── entity
├── repository
├── runner
└── service
```
