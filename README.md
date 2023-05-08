# Full Stack Movie Base App: Server

Full Stack movie base application: REST API server and Database

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# run db
$ docker compose up dev-db -d

# restart db
$ npm run db:dev:restart
```

## ToDo List

Main:
- [x] Create a basic authentication system
- [x] Create a mail verification system
- [x] Create a basic password refresh system
- [x] Create _users_ endpoints
- [x] Create _favorites_ endpoints
- [x] Create _movies_ endpoints
- [ ] Create a Docker container for the server

Bonus:
- [ ] Add automated tests
- [ ] Add GraphQL queries
- [ ] Replace the token generator with a stronger one

## ORM

Prisma

## RDBMS

Postgresql: 13

##
