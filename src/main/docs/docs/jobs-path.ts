export const jobsWithIdPath = {
  get: {
    tags: ["Vagas"],
    sumary: "API para listar todos os candidatos à vaga",
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
                code: {
                  type: "integer",
                  summary: "Conforme o padrão Rest API",
                  example: 200,
                },
                message: {
                  type: "string",
                  example:
                    "Candidates from the Job application successfully listed",
                },
                data: {
                  type: "object",
                  properties: {
                    job: {
                      $ref: "#/schemas/job",
                    },
                    candidates: {
                      type: "array",
                      items: {
                        $ref: "#/schemas/user",
                      },
                    },
                  },
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
};

export const jobsAllPath = {
  get: {
    tags: ["Vagas"],
    sumary: "API para listar todas as vagas",
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
                code: {
                  type: "integer",
                  summary: "Conforme o padrão Rest API",
                  example: 200,
                },
                message: {
                  type: "string",
                  example: "Jobs successfully listed",
                },
                data: {
                  type: "array",
                  items: {
                    $ref: "#/schemas/job",
                  },
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
};

export const jobsPath = {
  post: {
    tags: ["Vagas"],
    sumary: "API para criar uma vagas",
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
              description: {
                type: "string",
                summary: "Descrição da vaga",
              },
              enterprise: {
                type: "string",
                summary: "Nome da empresa",
              },
              limitData: {
                type: "string",
                summary: "Data limite para aplicação",
              },
              isActive: {
                type: "boolean",
                summary: "Indica se a vaga está ativa ou não",
              },
            },
            required: ["description", "enterprise", "limitData", "isActive"],
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
                  example: "Job successfully created",
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
