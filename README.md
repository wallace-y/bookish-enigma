# House of Games API

Link to hosted site [here](https://game-reviews-8ld1.onrender.com).

## Summary

This project is a API for a game reviews. It is built with Node.js and Express, using a PostgreSQL database to store and retrieve data. The API allows users to create, read, update and delete data for various endpoints, including users, reviews, comments and categories.

## Clone and Setup Instructions

1. Install Node.js and PostgreSQL on your machine, if they are not already installed.
2. Clone the repository to your local machine using the following command:

```
git clone https://github.com/wallace-y/bookish-enigma.git
```

3. Install dependencies by running the following command in the project's root folder:

```
npm install
```

4. Create the necessary databases by running the following command:

```
npm run setup-dbs
```

5. Seed the development database with data by running the following command:

```
npm run seed
```

6. Create two .env files in the project's root folder: **.env.test** and **.env.development.**
7. Add **PGDATABASE=<database_name_here>** to each .env file, as follows:

   - .env.test: **PGDATABASE=nc_games_test**
   - .env.development: **PGDATABASE=nc_games**

   **Note: Ensure that both .env files are .gitignored.**

## Starting the server

1. Start the server by running the following command:

```
npm start
```

## Running Tests

To run tests for this project, follow these steps:

1. Ensure that you have followed the setup instructions above, including creating the .env.test file.

2. Run the following command to execute the tests:

```
npm test
```
