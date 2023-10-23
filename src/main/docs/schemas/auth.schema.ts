export const authSchema = {
  type: "object",
  properties: {
    user: {
      $ref: "#/schemas/user",
      summary: "Usuário que realizou o login",
    },
    token: {
      type: "string",
      summary: "Token para usuário informar nas requisições",
    },
  },
  required: ["user", "token"],
};
