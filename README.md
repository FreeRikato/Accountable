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
   - /\* : Middleware to authenticate users
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
- Expo with React Native
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

### Sequelize workflow

| Step | Manual Workflow                       | CLI Workflow                                          |
| ---- | ------------------------------------- | ----------------------------------------------------- |
| 1    | Install Sequelize and database driver | Install Sequelize, Sequelize CLI, and database driver |
| 2    | Create database connection            | Initialize Sequelize project structure                |
| 3    | Define models                         | Configure database connection                         |
| 4    | Create database tables                | Generate models using CLI                             |
| 5    | Perform database operations           | Generate migrations using CLI                         |
| 6    | Handle migrations manually            | Run migrations                                        |
| 7    | -                                     | Generate seeders (optional)                           |
| 8    | -                                     | Run seeders (optional)                                |
| 9    | -                                     | Perform database operations                           |

#### Install Sequelize, Sequelize CLI, and database driver

> Seems the Sequelize ORM requires two dependencies to operate => pg and
> pg-hstore
>
> - pg: PostgreSQL client for Node.js
> - pg-hstore: module for serializing and deserializing JSON data into the
>   hstore format

```bash
# Install Sequelize
pnpm add sequelize
# Insall Database Driver
pnpm add pg pg-hstore
# Optional for CLI workflow
pnpm add -D sequelize-cli
```

Now, that i have setup neon db for serverless postgresql in singapore. I will
copy the connection string to .env

~ Also, Created .gitignore and added .env + node_modules just in case

#### Initialize Sequelize Project

- Create a file for initializing the database connection

```typescript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('your_database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres', // Change to mysql/sqlite/mariadb as needed
});

try {
  await sequelize.authenticate();
  console.log('Database connected');
} catch (err) {
  console.error('Connection error:', err);
}

export default sequelize;
```

- Instead of manual initialization this can be done with CLI

```bash
npx sequelize-cli init
```

> Generating the below directory structure:

```
/models - Create and update models
/migrations - Modify database schema
/seeders - Populate the database with seeders
/config/config.json - ensures the correct database is targeted
```

```json
{
  "development": {
    "username": "your_username",
    "password": "your_password",
    "database": "your_database",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

#### Define Models

- Creating model file gives great customization and flexibility

```typescript
import { DataTypes } from 'sequelize'
import sequelize from '../db'

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
});

export defaut User;
```

- Also, this is possible with CLI boosting the developer experience. From the
  generated model file in the directory, edit it:

```bash
npx sequelize-cli model:generate --name User --attributes name:string,email:string
```

Shit, this is confusing. I have to generate this and then edit in both models
and migrations as well. Instead, I have to setup `sync()` which would cause
issues in production and only used in development. This could be setup with =>

> **NOTE**: Automatic model to table migrations can be synced with `sync()`, which
> can be done to all models using `sequelize.sync()` or selectively using
> `model_name.sync()`

```typescript
await User.sync({ force: true });
```

I have two choices,

1. Use it with `authenticate()` and run it manually `node scripts/sync.js`
2. Dynamic syncing with:

```typescript
if (process.env.NODE_ENV === 'DEVELOPMENT') await User.sync({ force: true });
```

#### Create Database Tables

- Use `sequlize.sync()` to create table from the model schema
- This is also possible with CLI, `npx sequelize-cli db:migrate`

#### Perform CRUD operations

| **Category** | **Functions**                              | **Important Attributes**                          |
| ------------ | ------------------------------------------ | ------------------------------------------------- |
| **Create**   | `create`, `bulkCreate`                     | `fields`, `returning`, `ignoreDuplicates`         |
| **Read**     | `findOne`, `findAll`, `findByPk`,          | `where`, `attributes`, `include`                  |
|              | `findOrCreate`, `count`, `findAndCountAll` | `include`, `limit`, `offset`, `raw`               |
| **Update**   | `update`, `increment`, `decrement`         | `where`, `fields`, `returning`, `validate`        |
| **Delete**   | `destroy`                                  | `where`, `individualHooks`, `truncate`, `cascade` |
