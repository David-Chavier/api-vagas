export const unauthorizedComponent = {
  description: 'Precisa estar autenticado para acessar essa rota',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
