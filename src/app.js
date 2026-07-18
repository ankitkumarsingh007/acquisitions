import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
// Helmet is a middleware that helps secure Express apps by setting various HTTP headers.
import morgan from 'morgan';
// Morgan is a middleware that logs HTTP requests and responses in a predefined format. It can be used for debugging and monitoring purposes

import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from '#routes/auth.routes.js';

const app = express();

// What we did here is we are using helmet and morgan middleware in our express app.
// Helmet helps secure the app by setting various HTTP headers, while morgan logs HTTP requests and responses in a predefined format.
app.use(helmet());
app.use(cors());
app.use(express.json()); // Handles application/json

app.use(
  express.urlencoded({
    extended: true,
  })
); // Handles application/x-www-form-urlencoded

app.use(cookieParser());

// This morgan middleware is used to log HTTP requests and responses in a predefined format.
// The 'combined' format includes information such as the remote address, request method, response status code, and user agent.
// The logs are written to the logger instance we created earlier, which can be configured to write to a file or console.
app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);

app.get('/', (req, res) => {
  logger.info('Hello from acquisition api');
  res.status(200).send('Hello from acquisition api');
});

app.get('/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).send({
    message: 'Acquisition API is running',
  });
});
// Get requests can be made directly using localhost, but for put,post,update we need to use http client
app.use('/api/auth', authRoutes);

export default app;
