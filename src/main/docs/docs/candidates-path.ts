export const candidatesPath = {
  get: {
    tags: ["Candidatos"],
    sumary: "API para listar todos candidatos",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                ok: {
                  type: "boolean",
                  summary: "Indica se a requisição deu certo ou não",
                  example: true,
                },
                message: {
                  type: "string",
                  example: "Recruiters successfully listed",
                },
                data: {
                  type: "array",
                  items: {
                    $ref: "#/schemas/users",
                  },
                  summary: "Retorna uma lista de recrutadores.",
                },
                code: {
                  type: "integer",
                  summary: "Conforme o padrão Rest API",
                  example: 200,
                },
              },
            },
          },
        },
      },
      401: {
        $ref: "#/components/unauthorized",
      },
      500: {
        $ref: "#components/serverError",
      },
    },
  },
  post: {
    tags: ["Candidatos"],
    sumary: "API para criar um candidato",
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                summary: "Nome do recrutador",
              },
              email: {
                type: "string",
                summary: "Email do recrutador",
              },
              password: {
                type: "string",
                summary: "Senha do recrutador",
              },
              enterpriseName: {
                type: "string",
                summary: "Nome da empresa",
              },
            },
            required: ["name", "email", "password", "enterpriseName"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Sucesso",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  summary: "Indica se a requisição deu certo ou não",
                  example: true,
                },
                message: {
                  type: "string",
                  example: "Candidate successfully created",
                },
                code: {
                  type: "integer",
                  summary: "Conforme o padrão Rest API",
                  example: 201,
                },
              },
            },
          },
        },
      },
      400: {
        $ref: "#/components/badRequest",
      },
      401: {
        $ref: "#/components/unauthorized",
      },
      500: {
        $ref: "#components/serverError",
      },
    },
  },
};
