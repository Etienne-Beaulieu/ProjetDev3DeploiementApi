import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import PieceRepo from '@src/repos/PieceRepo';
import { IPiece } from '@src/models/Piece';

export const PIECE_NOT_FOUND_ERR = 'Piece not found';

/**
 * Get one piece.
 */
async function getOne(id: string): Promise<IPiece> {
  const piece = await PieceRepo.getOne(id);
  if (piece == null) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, PIECE_NOT_FOUND_ERR);
  }
  return piece;
}

/**
 * Get all pieces.
 */
function getAll(): Promise<IPiece[]> {
  return PieceRepo.getAll();
}

/**
 * Get all pieces sur le compositeur est en vie ou pas.
 */
function getIsAlive(isAlive: boolean): Promise<IPiece[]> {
  return PieceRepo.getIsAlive(isAlive);
}

/**
 * Get all pieces filtre sur entre deux annees.
 */
function getBetweenYears(start: number, end: number): Promise<IPiece[]> {
  return PieceRepo.getBetweenYears(start, end);
}

/**
 * Add one piece.
 */
function addOne(piece: IPiece): Promise<void> {
  return PieceRepo.add(piece);
}

/**
 * Update one piece.
 */
async function updateOne(piece: IPiece): Promise<void> {
  if (piece._id == undefined)
  {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, PIECE_NOT_FOUND_ERR)
  }
  const persists = await PieceRepo.getOne(piece._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, PIECE_NOT_FOUND_ERR);
  }
  // Return piece
  return PieceRepo.update(piece);
}

/**
 * Delete one piece avec le id.
 */
async function _delete(id: string): Promise<void> {
  const persists = await PieceRepo.getOne(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, PIECE_NOT_FOUND_ERR);
  }
  // Delete piece
  return PieceRepo.delete(id);
}

export default {
  getOne,
  getAll,
  getIsAlive,
  getBetweenYears,
  addOne,
  updateOne,
  delete: _delete,
} as const;
