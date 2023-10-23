export const serverErrorComponent = {
  description: "Erro interno no servidor",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          ok: {
            type: "boolean",
            summary: "Indica se a requisição deu certo ou não",
            example: false,
          },
          error: {
            type: "string",
          },
        },
      },
    },
  },
};
