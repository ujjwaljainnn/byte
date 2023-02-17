import type { Interests, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserInterests(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } }).interests();
}

export async function getAllInterests() {
  return prisma.interests.findMany();
}

export async function updateUserInterests(
  id: User["id"],
  interests: Interests["id"][]
) {
  return prisma.user.update({
    where: { id },
    data: { interests: { connect: interests.map((id) => ({ id })) } },
  });
}
