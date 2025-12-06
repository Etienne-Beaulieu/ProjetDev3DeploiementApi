import { Schema, model } from 'mongoose';

export interface IPiece {
  _id?: string;
  pieceName: string;
  compositorName: string;
  durationMinutes: number;
  dateOfRelease: Date;
  compositorIsAlive: boolean;
  instruments: string[];
  difficultyLevel: number;
  styles: string[];
  compositorImageUrl: string;
}

// Schema avec les validations personalisees
const PieceSchema = new Schema<IPiece>({
  pieceName: {
    type: String,
    required: [true, 'Le nom de la pièce est requis'],
    maxlength: [100, 'La longueur du nom de la pièce ne doit pas dépasser 100 caractères'],
  },
  compositorName: {
    type: String,
    required: [true, 'Le nom du compositeur est requis'],
    maxlength: [100, 'La longueur du nom du compositeur ne doit pas dépasser 100 caractères'],
  },
  durationMinutes: {
    type: Number,
    required: [true, 'La durée est requise'],
    min: [0, 'La durée doit être positive'],
  },
  dateOfRelease: {
    type: Date,
    required: [true, 'La date de sortie est requise'],
    validate: {
      validator: function (date: Date) {
        return date <= new Date();
      },
      message: 'La date de sortie ne peut pas être dans le futur',
    },
  },
  compositorIsAlive: {
    type: Boolean,
    required: [true, 'Le statut du compositeur est requis'],
  },
  instruments: {
    type: [String],
    required: [true, 'Les instruments sont requis'],
    validate: [
      {
        validator: function (arr: string[]) {
          return arr.every((i) => i.length <= 100);
        },
        message: 'Chaque instrument ne doit pas dépasser 100 caractères',
      },
      {
        validator: function (arr: string[]) {
          return new Set(arr).size === arr.length;
        },
        message: 'Les instruments ne doivent pas être en double',
      },
    ],
  },
  difficultyLevel: {
    type: Number,
    required: [true, 'Le niveau de difficulté est requis'],
    min: [1, 'La difficulté minimale est 1'],
    max: [6, 'La difficulté maximale est 6'],
  },
  styles: {
    type: [String],
    required: [true, 'Les styles sont requis'],
    validate: [
      {
        validator: function (arr: string[]) {
          return arr.every((s) => s.length <= 50);
        },
        message: 'Chaque style ne doit pas dépasser 50 caractères',
      },
      {
        validator: function (arr: string[]) {
          return new Set(arr).size === arr.length;
        },
        message: 'Les styles ne doivent pas être en double',
      },
    ],
  },
  compositorImageUrl: {
    type: String,
    required: [true, 'L\'url de la photo du compositeur est requise.'],
    maxlength: [200, 'La longueur de l\'url de la photo du compositeure ne doit pas dépasser 200 caractères'],
  },
});

export const Piece = model<IPiece>('Piece', PieceSchema);