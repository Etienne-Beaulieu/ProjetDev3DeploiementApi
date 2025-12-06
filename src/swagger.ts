import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../package.json';
import logger from 'jet-logger';


// Tirer de https://www.youtube.com/watch?v=dhMlXoTD3mQ&t=189s
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Pieces',
      version,
      description: 'API documentation for Pieces',
    },
    components: {
      schemas: {
        Piece: {
          type: 'object',
          properties: {
            pieceName: { type: 'string' },
            compositorName: { type: 'string' },
            durationMinutes: { type: 'number' },
            dateOfRelease: { type: 'string', format: 'date' },
            compositorIsAlive: { type: 'boolean' },
            instruments: { type: 'array', items: { type: 'string' } },
            difficultyLevel: { type: 'number' },
            styles: { type: 'array', items: { type: 'string' } },
            compositorImageUrl: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {

    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get('/doc.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    logger.info(`Doc available at http://localhost:${port}/doc`);
}

export default swaggerDocs;