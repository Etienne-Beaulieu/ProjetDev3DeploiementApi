import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import apiRouter from '@src/routes/index';

import Paths from '@src/common/constants/Paths';
import ENV from '@src/common/constants/ENV';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/util/route-errors';
import { NodeEnvs } from '@src/common/constants';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

if (ENV.NodeEnv === NodeEnvs.Production && !process.env.DISABLE_HELMET) {
  app.use(helmet());
}

// Page d'accueil simple (avant l'authentification)
app.get('/', (_: Request, res: Response) => {
  res.send('Bienvenue sur l\'API Pieces !');
});

app.use(Paths.Base, apiRouter);

// Gerer les erreurs
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }

  if (err instanceof RouteError) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
});

const viewsDir = path.join(__dirname, 'views');
const staticDir = path.join(__dirname, 'public');

app.set('views', viewsDir);
app.use(express.static(staticDir));

export default app;