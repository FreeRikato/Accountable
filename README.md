# Notes for developing this web application

Accountable, I know. Such a basic name for an application. Brainrot so bad i
don't have any other name.

## API endpoints planned for the application - 

1. /api/v1/user -
    - (GET) / : Get user details
    - (POST) /signup : Sign up new users
    - (POST) /login : Sign in existing users
    - (GET) /userId : Get specific user details with `userId`

    > - (PUT) / : Update details of existing user
    > - (DELETE) / : Delete user account

2. /api/v1/account -
    - /* : Middleware to authenticate users
    - (GET) / : Get all the accountability data
    - (POST) / : Post new accountability data
    - (PUT) / : Update existing accountability data
    - (DELETE) / : Delete existing accountability data
    - (GET) /userId : Get accountability data of specific user with `userId`
    - (GET) /date: Get accountability data for all users at the specific `data`

## Tech stack

- Node.js
- Express
- Postgresql (Neon DB => Serverless)
- Sequelize
- React => React-router-dom, Zustand
- Tailwind, Shadcn

## Backend boilerplate


```bash
mkdir backend
cd backend
pnpm init
tsc --init
mkdir src dist
# Change rootDir and outDir to src and dist correspondingly
pnpm add express sequelize pg pg-hstore dotenv
pnpm add --save-dev ts-node-dev @types/express
```

Setting up the express boilerplate is as usual easy. Used ts-node-dev --respawn
--transpile-only src/index.ts to setup typescript server that is live and
updates on saving changes (switched from nodemon - setting up nodemon.json is
annoying and bad)

```jsonc
// package.json
scripts: {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts
}
```

## Sequelize

Did not plan to do this project with sequelize but change of mind, I want to
learn this since RQ prefers it

ORM: allow devs to interact with Databases using OOPS instead of Raw queries

> Seems the Sequelize ORM requires two dependencies to operate => pg and
> pg-hstore
> - pg: PostgreSQL client for Node.js
> - pg-hstore: module for serializing and deserializing JSON data into the
>   hstore format

Now, that i have setup neon db for serverless postgresql in singapore. I will
copy the connection string to .env

~ Also, Created .gitignore and added .env + node+modules just in case

Refer `./backend/src/db/index.ts`
