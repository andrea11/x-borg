import { initContract } from '@ts-rest/core';
import { z } from "zod";

const c = initContract();

const PostSchema = z.object({
  signingAddress: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ErrorSchema = z.object({
  errors: z.array(z.object({
    message: z.string(),
  }))
});

export const user = c.router({
  getUser: {
    method: 'GET',
    path: `/user/:signingAddress`,
    responses: {
      200: PostSchema,
      401: ErrorSchema,
      404: ErrorSchema
    },
    summary: 'Get a user by id',
  },
});