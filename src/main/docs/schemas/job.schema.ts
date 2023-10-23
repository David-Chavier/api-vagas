export const jobSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    description: {
      type: "string",
    },
    enterprise: {
      type: "string",
    },
    limitDate: {
      type: "string",
    },
    isActive: {
      type: "string",
    },
    idRecruiter: {
      type: "string",
    },
    maxCandidate: {
      type: "number",
    },
  },
  required: [
    "id",
    "description",
    "enterprise",
    "limitDate",
    "isActive",
    "maxCandidate",
  ],
};
