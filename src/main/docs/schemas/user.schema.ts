export const userSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      summary: "Identificador do usuário",
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    type: {
      type: "string",
    },
    enterpriseName: {
      type: "string",
    },
  },
  required: ["id", "name", "email", "type", "enterpriseName"],
};

export const usersSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      summary: "Identificador do produto",
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    type: {
      type: "string",
      summary:
        "Indica indica se se o usuário é um administrador, recrutador ou candidato",
    },
  },
  required: ["id", "name", "email", "type"],
};
