export const errorSchema = {
  type: "object",
  properties: {
    ok: {
      type: "boolean",
      summary: "Indica se a requisição deu certo ou não",
      example: false,
    },
    message: {
      type: "string",
      summary: "Mensagem amigável para mostrar ao usuário",
    },
    code: {
      type: "integer",
      summary: "Conforme o padrão Rest API",
    },
  },
};
