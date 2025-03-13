import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IOE Notices API',
      version: '1.0.0',
      description: 'API for scraping and fetching notices from IOE exam site',
      contact: {
        name: 'Sandip Sapkota',
        url: 'https://github.com/dev-sandip'
      }
    },
    servers: [{ url: process.env.DOMAIN || 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ['./routes/*.js'] // Swagger will scan routes folder for API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;
