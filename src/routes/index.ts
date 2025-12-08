import { Request, Response, NextFunction, Router } from 'express';
import Paths from '@src/common/constants/Paths';
import PieceRoutes from './PieceRoutes';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Piece } from '@src/models/Piece';

const apiRouter = Router();

// Validation du body pour piece
function validatePiece(req: Request, res: Response, next: NextFunction) {
  if (!req.body || !req.body.piece) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Piece requise' })
      .end();
  }

  const nouvellePiece = new Piece(req.body.piece);
  const error = nouvellePiece.validateSync();
  if (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  }
  next();
}

/*********************************
 * Piece routes
 *********************************/

// Tirer de https://www.youtube.com/watch?v=dhMlXoTD3mQ&t=189s
const pieceRouter = Router();

/**
 * @openapi
 * /pieces/all:
 *   get:
 *     tags: [Pieces]
 *     summary: Récupérer toutes les pièces
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les pièces
 */
pieceRouter.get(Paths.Pieces.Get, PieceRoutes.getAll);

/**
 * @openapi
 * /pieces/one/{id}:
 *   get:
 *     tags: [Pieces]
 *     summary: Récupérer une pièce par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retourne la pièce demandée
 *       404:
 *         description: Pièce introuvable
 */
pieceRouter.get(Paths.Pieces.GetOne, PieceRoutes.getOne);

/**
 * @openapi
 * /pieces/alive/{isAlive}:
 *   get:
 *     tags: [Pieces]
 *     summary: Récupérer les pièces selon si le compositeur est vivant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: isAlive
 *         in: path
 *         required: true
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Liste des pièces filtrées par statut du compositeur
 */
pieceRouter.get(Paths.Pieces.GetIsAlive, PieceRoutes.getIsAlive);

/**
 * @openapi
 * /pieces/between/{start}/{end}:
 *   get:
 *     tags: [Pieces]
 *     summary: Récupérer les pièces publiées entre deux années
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: start
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: end
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des pièces publiées entre les années spécifiées
 */
pieceRouter.get(Paths.Pieces.GetBetweenYears, PieceRoutes.getBetweenYears);

/**
 * @openapi
 * /pieces/add:
 *   post:
 *     tags: [Pieces]
 *     summary: Ajouter une nouvelle pièce
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               piece:
 *                 $ref: '#/components/schemas/Piece'
 *     responses:
 *       201:
 *         description: Pièce créée avec succès
 */
pieceRouter.post(Paths.Pieces.Add, validatePiece, PieceRoutes.add);

/**
 * @openapi
 * /pieces/update:
 *   put:
 *     tags: [Pieces]
 *     summary: Mettre à jour une pièce
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               piece:
 *                 $ref: '#/components/schemas/Piece'
 *     responses:
 *       200:
 *         description: Pièce mise à jour avec succès
 */
pieceRouter.put(Paths.Pieces.Update, PieceRoutes.update);

/**
 * @openapi
 * /pieces/delete/{id}:
 *   delete:
 *     tags: [Pieces]
 *     summary: Supprimer une pièce
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pièce supprimée avec succès
 */
pieceRouter.delete(Paths.Pieces.Delete, PieceRoutes.delete);

apiRouter.use(Paths.Pieces.Base, pieceRouter);

export default apiRouter;