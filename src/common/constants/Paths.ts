// Mes routes, j'ai enlever le JWT y'avait rien a faire je comprend pas comment ca marche ca faisait geler mon react
export default {
  Base: '/api',
  Pieces: {
    Base: '/pieces',
    Get: '/all',
    GetOne: '/one/:id',
    GetIsAlive: '/alive/:isAlive',
    GetBetweenYears: '/between/:start/:end',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
