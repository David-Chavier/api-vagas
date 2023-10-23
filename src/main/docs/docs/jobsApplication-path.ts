export const jobsApplicationPath = {
  get: {
    tags: ["Aplicações para vagas"],
    sumary: "API para listar todas as vagas aplicadas",
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
                  example: "Jobs from the Job application successfully listed",
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

export const jobsApplicationWithIdPath = {
  post: {
    tags: ["Aplicações para vagas"],
    sumary: "API para criar uma aplicação para à vaga",
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
                  example: "Job Application successfully created",
                },
                code: {
                  type: "integer",
                  summary: "Conforme o padrão Rest API",
                  example: 200,
                },
                data: {
                  type: "object",
                  properties: {
                    candidates: {
                      $ref: "#/schemas/user",
                    },
                    job: {
                      $ref: "#/schemas/job",
                    },
                  },
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
