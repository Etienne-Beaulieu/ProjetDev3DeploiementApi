import insertUrlParams from 'inserturlparams';
import { customDeepCompare } from 'jet-validators/utils';

import PieceRepo from '@src/repos/PieceRepo';

import { PIECE_NOT_FOUND_ERR } from '@src/services/PieceService';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ValidationError } from '@src/common/util/route-errors';

import Paths from './common/Paths';
import { parseValidationErr, TRes } from './common/util';
import { agent } from './support/setup';
import { IPiece, Piece } from '@src/models/Piece';

/******************************************************************************
                               Constants
******************************************************************************/

// Données bidon pour les pieces (simulacre de GET)
const DB_PIECES: IPiece[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    pieceName: "Some Piece 1",
    compositorName: "Some Composer 1",
    durationMinutes: 5,
    dateOfRelease: new Date('2020-01-01'),
    compositorIsAlive: true,
    instruments: ["Piano", "Violin"],
    difficultyLevel: 3,
    styles: ["Classical", "Baroque"],
    compositorImageUrl: "https://example.com/image1.jpg",
  },
  {
    _id: '507f1f77bcf86cd799439012',
    pieceName: "Some Piece 2",
    compositorName: "Some Composer 2",
    durationMinutes: 3,
    dateOfRelease: new Date('2021-01-01'),
    compositorIsAlive: false,
    instruments: ["Guitar", "Drums"],
    difficultyLevel: 1,
    styles: ["Classical"],
    compositorImageUrl: "https://example.com/image2.jpg",
  },
  {
    _id: '507f1f77bcf86cd799439013',
    pieceName: "Some Piece 3",
    compositorName: "Some Composer 3",
    durationMinutes: 10,
    dateOfRelease: new Date('2022-01-01'),
    compositorIsAlive: true,
    instruments: ["Piano"],
    difficultyLevel: 5,
    styles: ["Jazz", "Blues"],
    compositorImageUrl: "https://example.com/image3.jpg",
  },
] as const;

// Comparaison en ignorant les _id et dateOfRelease
const comparePieceArrays = customDeepCompare({
  onlyCompareProps: [
    'pieceName',
    'compositorName',
    'durationMinutes',
    'compositorIsAlive',
    'instruments',
    'difficultyLevel',
    'styles',
    'compositorImageUrl',
  ],
});

const mockify = require('@jazim/mock-mongoose');

/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that 
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection). 
******************************************************************************/

describe('pieceRouter', () => {
  let dbPieces: IPiece[] = [];

  // GET all pieces
  describe(`'GET:${Paths.Pieces.Get}'`, () => {
    it(`doit retourner un JSON avec toutes les pieces et un code ${HttpStatusCodes.OK} si réussi.`, async () => {
      const data = [...DB_PIECES];
      mockify(Piece).toReturn(data, 'find');
      const res: TRes<{ pieces: IPiece[] }> = await agent.get(Paths.Pieces.Get);
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(comparePieceArrays(res.body.pieces, DB_PIECES)).toBeTruthy();
    });
  });

  // GET one piece
  describe(`'GET:${Paths.Pieces.GetOne}'`, () => {
    it(`doit retourner un JSON avec une piece et un code ${HttpStatusCodes.OK} si réussi.`, async () => {
      const piece = DB_PIECES[0];
      mockify(Piece).toReturn(piece, 'findOne');
      const path = Paths.Pieces.GetOne.replace(':id', piece._id!);
      const res: TRes<{ piece: IPiece }> = await agent.get(path);
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.piece.pieceName).toBe(piece.pieceName);
    });
  });

  // POST add piece
  describe(`'POST:${Paths.Pieces.Add}'`, () => {
    it(`doit retourner le code ${HttpStatusCodes.CREATED} si la transaction est réussie`, async () => {
      const piece: IPiece = {
        pieceName: "New Piece",
        compositorName: "New Composer",
        durationMinutes: 7,
        dateOfRelease: new Date('2023-01-01'),
        compositorIsAlive: true,
        instruments: ["Flute"],
        difficultyLevel: 2,
        styles: ["Modern"],
        compositorImageUrl: "https://example.com/new.jpg",
      };
      
      // Préparer le simulacre de Mongoose
      mockify(Piece).toReturn(piece, 'save');
      
      const res = await agent.post(Paths.Pieces.Add).send({ piece });
      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body.success).toBe(true);
    });

    it(`doit retourner un JSON avec les erreurs et un code ${HttpStatusCodes.BAD_REQUEST} si un paramètre est manquant.`, async () => {
      const res: TRes = await agent.post(Paths.Pieces.Add).send({ piece: null });
      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe('Piece requise');
    });
  });

  // PUT update piece
  describe(`'PUT:${Paths.Pieces.Update}'`, () => {
    it(`doit retourner un code ${HttpStatusCodes.OK} si la mise à jour est réussie.`, async () => {
      const piece = { ...DB_PIECES[0] };
      piece.pieceName = 'Updated Name';
      mockify(Piece)
        .toReturn(piece, 'findOne')
        .toReturn(piece, 'save');
      const res = await agent.put(Paths.Pieces.Update).send({ piece });
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.success).toBe(true);
    });

    it(`doit retourner un JSON avec erreur '${PIECE_NOT_FOUND_ERR}' et un code ${HttpStatusCodes.NOT_FOUND} si l'id n'est pas trouvé.`, async () => {
      mockify(Piece).toReturn(null, 'findOne');
      const piece = { ...DB_PIECES[0], _id: '507f1f77bcf86cd799439099' };
      const res: TRes = await agent.put(Paths.Pieces.Update).send({ piece });
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(res.body.error).toBe(PIECE_NOT_FOUND_ERR);
    });
  });

  // DELETE piece
  describe(`'DELETE:${Paths.Pieces.Delete}'`, () => {
    const getPath = (id: string) => insertUrlParams(Paths.Pieces.Delete, { id });

    it(`doit retourner un code ${HttpStatusCodes.OK} si la suppression est réussie.`, async () => {
      const piece = DB_PIECES[0];
      mockify(Piece)
        .toReturn(piece, 'findOne')
        .toReturn(piece, 'findOneAndRemove');
      const res = await agent.delete(getPath(piece._id!));
      expect(res.status).toBe(HttpStatusCodes.OK);
      expect(res.body.success).toBe(true);
    });

    it(`doit retourner un JSON avec erreur '${PIECE_NOT_FOUND_ERR}' et un code ${HttpStatusCodes.NOT_FOUND} si la piece est introuvable.`, async () => {
      mockify(Piece).toReturn(null, 'findOne');
      const res: TRes = await agent.delete(getPath('507f1f77bcf86cd799439099'));
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(res.body.error).toBe(PIECE_NOT_FOUND_ERR);
    });
  });
});
