import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Get the DATABASE URL from .env, if not present then take empty string
const DATABASE_URL = process.env.DATABASE_URL || "";

// Initializing Sequelize and connecting to the database feels like working with mongoose
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres", // Specifies the type of database being used
  protocol: "postgres", // Defines the protocol used for the connection
  dialectOptions: {
    // Additional Dialect specfic options
    ssl: {
      // Setting up SSL is required since NeonDB required SSL connections by default
      require: true,
      rejectUnauthorized: false,
      // DEVELOPMENT - disables SSL certificate validation to simplify local development
      // PRODUCTION -
    },
  },
});

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database using sequelize is successful");
  } catch (e) {
    console.error("Connection to database using sequelize is unsuccessful");
  }
};

authenticate();
