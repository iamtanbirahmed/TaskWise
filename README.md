# TaskWise

Simple To-Do list application built with NestJs, Angular and MongoDb.

- Login
- CRUD operation on a new List
- CRUD operation on a List Item

## Running the app

It will run docker containers for all the components. The application will be accessible at `http://localhost:4200`

```bash
# To run the entire application
$ make run
```

### Other running options:

```bash
# To run just mongodb and mongodb-express
$ make run-db

# To run just full backend with database and backend service
$ make run-be
```

## Test

```bash
# To run all the unit test
$ make test

# To run only the backend tests
$ make test-be

# To run only the fronend tests
$ make test-fe
```

## e2e Test

e2e tests are only added to the backend service. It requires the `Database` to be up.

```bash
# To run e2e tests
make test-e2e
```

## Credentials

Three users are automatically added to the `Database` during start-up for convenienece.

```bash
john@test.com:changeme
```

```bash
bob@test.com:changeme
```

```bash
alice@test.com:changeme
```

Mongodb Exress is accessible at `http:localhost:8081`. The credentials are default `admin:pass`

## .env Files:

The `.env` files are deliberately added to the repository for convenience. This SHOULD NOT be done to real projects.

### Node Environment

Locally the application was build in `Node:v21.5.0`.
