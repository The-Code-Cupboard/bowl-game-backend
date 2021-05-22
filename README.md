
To run server - `npm start`
To run server in development mode (listening for changes) - `npm run dev`
To deploy server to heroku - `git push heroku main`

If building SQL database locally:

SQL commands required to initialize database
CREATE DATABASE bowlgamelocal;
\c bowlgamelocal
CREATE TABLE words (id varchar(255) NOT NULL, text varchar(255) NOT NULL, userid varchar(255) NOT NULL);
CREATE TABLE users (id varchar(255) PRIMARY KEY, username varchar(255) UNIQUE);

Code currently assumes the following:
database name: bowlgamelocal
database username: postgres
database password: password
database URL: localhost
database port: 5432


To run unit testing - `jest`