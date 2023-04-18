import type { User } from "@prisma/client"
import { prisma } from "@/db";

export const userService = {
  getUser: async (signingAddress: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { signingAddress } })
  },
  createUser: async (signingAddress: string): Promise<User> => {
    return prisma.user.create({ data: { signingAddress } })
  }
}