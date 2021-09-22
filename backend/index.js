import express from 'express';
import color from 'colors';
import path from 'path';

// import for database
import db from './config/db.js';

// import env variables
import dotenv from 'dotenv';

// import for routes
import userRoutes from './routes/userRoutes.js';

// import for middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// -------------------------------------------------

// set up env files
dotenv.config();

// init server
const app = express();

// accept json body for auth
app.use(express.json());

// routes
// app.use('/api/users', userRoutes);
app.get('/api/users', async (req, res) => {
  // get all
  const users = await db.query('SELECT * FROM users');
  // get one
  const users = await db.query(
    `SELECT * FROM users WHERE user_id = ${req.params.id}`
  );
  // create one
  const users = await db.query(
    'INSERT INTO users (first_name, last_name, email, password) values ($1, $2, $3, $4)',
    [req.body.firstName, req.body.lastName, req.body.email, req.body.password]
  );
  // update one
  const users = await db.query(
    'UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4',
    [req.body.firstName, req.body.lastName, req.body.email, req.body.password]
  );
  // delete one
  const users = await db.query(`DELETE FROM users WHERE user_id = $1`, [
    req.params.id,
  ]);

  console.log(users.rows);
});

// production setup

// error routes
// app.use(notFound);
// app.use(errorHandler);

// set port
const PORT = process.env.PORT || 5001;

// confirm server is running
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
