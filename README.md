# Northcoders News API

A backend express API for a reddit-like website with users, articles, topics and comments.

Hosted on: https://be-nc-news-goodyguts.herokuapp.com/api

Front-end I helped build hosted on: https://nc-games-front.herokuapp.com/

## Installation instructions

To run the project:

- Clone from github using `git clone`
- Install project dependencies using `npm i`
- Create the relevant databases in your local postgresql database using `npm run setup-dbs`
- You must then include a `.env.test` and `.env.development` file with the `PGDATABASE` environment variable correctly set to the relevant databases.
- Seed the database by running `npm run seed`.
- Finally you can use `npm start` to run the test server.
