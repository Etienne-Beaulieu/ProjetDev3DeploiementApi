import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import PieceService from '../services/PieceService';
import { IPiece } from '../models/Piece';

import { IReq, IRes } from './common/types';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one piece.
 */
async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const piece = await PieceService.getOne(id as string);
  res.status(HttpStatusCodes.OK).json({ piece });
}

/**
 * Get all pieces.
 */
async function getAll(_: IReq, res: IRes) {
  const pieces = await PieceService.getAll();
  res.status(HttpStatusCodes.OK).json({ pieces });
}

/**
 * Get all pieces sur le compositeur est en vie ou pas.
 */
async function getIsAlive(req: IReq, res: IRes) {
  const { isAlive } = req.params;
  const isAliveBool = isAlive === "true";
  const pieces = await PieceService.getIsAlive(isAliveBool);
  res.status(HttpStatusCodes.OK).json({ pieces });
}

/**
 * Get all pieces filtre sur le compositeur est en vie ou pas.
 */
async function getBetweenYears(req: IReq, res: IRes) {
  const { start, end } = req.params;
  const startNum = Number(start);
  const endNum = Number(end);
  const pieces = await PieceService.getBetweenYears(startNum as number, endNum as number);
  res.status(HttpStatusCodes.OK).json({ pieces });
}

/**
 * Add one piece.
 */
async function add(req: IReq, res: IRes) {
  const { piece } = req.body;
  await PieceService.addOne(piece as IPiece);
  // Retourne un json pour react
  res.status(HttpStatusCodes.CREATED).json({ success: true });
}

/**
 * Update one piece.
 */
async function update(req: IReq, res: IRes) {
  const { piece } = req.body;
  await PieceService.updateOne(piece as IPiece);
  // Retourne un json pour react
  res.status(HttpStatusCodes.OK).json({ success: true });
}

/**
 * Delete one piece.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = req.params;

  try {
    await PieceService.delete(id as string);
    // Retourne un json pour react
    res.status(HttpStatusCodes.OK).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
  }
}

export default {
  getOne,
  getAll,
  getIsAlive,
  getBetweenYears,
  add,
  update,
  delete: delete_,
} as const;
