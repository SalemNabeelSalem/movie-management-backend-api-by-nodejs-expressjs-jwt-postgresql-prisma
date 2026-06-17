import {config} from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

config();

const PORT = process.env.SERVER_PORT || 3000;

const PRODUCTION_URL = `${process.env.RENDER_EXTERNAL_URL}`;

const LOCAL_URL = `http://localhost:${PORT}`;

const isProduction = process.env.NODE_ENV === 'production';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie API',
      version: '1.0.0',
      description: 'API documentation for the Movie API',
    },
    tags: [
      {
        name: 'Health Check',
        description: 'Endpoints related to health check',
      }
    ],
    servers: [
      {
        url: isProduction ? PRODUCTION_URL : LOCAL_URL,
        description: isProduction ? 'Production server' : 'Local server',
      },
    ],
  },
  // Path to the API route files for Swagger documentation
  apis: ['./src/routes/*.js', './src/server.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default function swaggerDocs(app, port) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Optional JSON endpoint for Swagger specification
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger UI is available at ${isProduction ? PRODUCTION_URL : LOCAL_URL}/api-docs`);
}