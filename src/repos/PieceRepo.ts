import { IPiece, Piece } from '../models/Piece';

/**
 * Get one piece.
 */
async function getOne(id: string): Promise<IPiece | null> {
  const piece = await Piece.findById(id);
  return piece;
}

/**
 * Get all pieces.
 */
async function getAll(): Promise<IPiece[]> {
  const pieces = await Piece.find();
  return pieces;
}

/**
 * Get all pieces filtre sur le compositeur est en vie ou pas.
 */
async function getIsAlive(isAlive: boolean): Promise<IPiece[]> {
  const pieces = await Piece.find({ compositorIsAlive: isAlive });
  return pieces;
}

/**
 * Get all pieces filtre entre telle et telle annee.
 */
async function getBetweenYears(start: number, end: number): Promise<IPiece[]> {
  const pieces = await Piece.find({
    dateOfRelease: {
      $gte: new Date(`${start}-01-01`),
      $lte: new Date(`${end}-12-31`)
    }
  });
  return pieces;
}

/**
 * Add one piece.
 */
async function add(piece: IPiece): Promise<void> {
  const nouvellePiece = new Piece(piece);
  await nouvellePiece.save();
}

/**
 * Update a piece.
 */
async function update(piece: IPiece): Promise<void> {
  const pieceAModifier = await Piece.findById(piece._id);
  if (pieceAModifier === null) {
    throw new Error("Piece non trouvé");
  }
  pieceAModifier.pieceName = piece.pieceName;
  pieceAModifier.compositorName = piece.compositorName;
  pieceAModifier.durationMinutes = piece.durationMinutes;
  pieceAModifier.dateOfRelease = new Date(piece.dateOfRelease);
  pieceAModifier.compositorIsAlive = piece.compositorIsAlive;
  pieceAModifier.instruments = piece.instruments;
  pieceAModifier.difficultyLevel = piece.difficultyLevel;
  pieceAModifier.styles = piece.styles;
  pieceAModifier.compositorImageUrl = piece.compositorImageUrl;
  await pieceAModifier.save();
}

/**
 * Delete one piece.
 */
async function delete_(id: string): Promise<void> {
  await Piece.findByIdAndDelete(id);
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
