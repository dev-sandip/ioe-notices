import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerDocs from './config/swaggerConfig.js';
import noticeRoutes from './routes/index.js';

dotenv.config();

const app = express();
app.use(json());

const windowMs = 5 * 60 * 1000;
const limiter = rateLimit({
  windowMs,
  max: 100,
  message: `Too many requests from this IP, please try again after ${windowMs / 60000} minutes`
});
app.use(limiter);

// Serve Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to IOE Notices API',
    endpoints: [
      { url: '/api-docs', description: 'Swagger Documentation' },
      { url: '/notices/all', description: 'Get all notices (requires Bearer token)' },
      { url: '/notices?page=1', description: 'Get notices of a specific page (requires Bearer token)' }
    ],
    author: 'Sandip Sapkota',
    github: 'https://github.com/dev-sandip'
  });
});
// Register Routes
app.use('/notices', noticeRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
