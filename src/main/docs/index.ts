import {
  jobsPath,
  jobsWithIdPath,
  jobsApplicationPath,
  jobsApplicationWithIdPath,
  authPath,
  candidatesPath,
} from "./docs";
import {
  badRequestComponent,
  unauthorizedComponent,
  notFoundComponent,
  securityComponent,
  serverErrorComponent,
} from "./components";
import {
  authSchema,
  jobSchema,
  errorSchema,
  usersSchema,
  userSchema,
} from "./schemas";
import { recruitersPath } from "./docs/recruiters-path";

export default {
  openapi: "3.0.0",
  info: {
    title: "API-Vagas",
    description: "Projeto com finalidade de aprendizado",
    version: "1.0.0",
  },
  servers: [
    {
      url: "/",
    },
  ],
  paths: {
    "/auth": authPath,
    "/recruiter": recruitersPath,
    "/candidate": candidatesPath,
    "/job": jobsPath,
    "/job/{id}/candidate": jobsWithIdPath,
    "/application/job": jobsApplicationPath,
    "/application/{id}": jobsApplicationWithIdPath,
  },
  schemas: {
    error: errorSchema,
    job: jobSchema,
    user: userSchema,
    auth: authSchema,
    users: usersSchema,
  },
  components: {
    badRequest: badRequestComponent,
    serverError: serverErrorComponent,
    notFound: notFoundComponent,
    unauthorized: unauthorizedComponent,
    securitySchemes: securityComponent,
  },
};
