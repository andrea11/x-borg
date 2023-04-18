import { prisma } from "@/db";
import { User } from "@prisma/client";

export const userService = {
  getUser: async (signingAddress: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { signingAddress } })
  },
  createUser: async (signingAddress: string): Promise<User> => {
    return prisma.user.create({ data: { signingAddress } })
  }
}