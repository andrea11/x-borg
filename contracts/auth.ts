import { initContract } from '@ts-rest/core';
import { z } from "zod";

const c = initContract();

const ErrorSchema = z.object({
  errors: z.array(z.object({
    message: z.string(),
  })),
});

export const auth = c.router({
  login: {
    method: 'POST',
    path: '/auth',
    responses: {
      200: z.object({}),
      201: z.object({}),
      400: ErrorSchema,
      401: ErrorSchema
    },
    body: z.object({
      signature: z.string(),
    }),
    summary: 'Authenticate a user against its signature',
    description: "This endpoint is used to authenticate a user against its signature. If the user doesn't exist, it will be created."
  },
});