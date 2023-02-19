import type { Interests, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserInterests(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } }).interests();
}

export async function getAllInterests() {
  return prisma.interests.findMany();
}

export async function createUserInterests(
  id: User["id"],
  interests: Interests["id"][]
) {
  return prisma.user.update({
    where: { id },
    data: { interests: { connect: interests.map((id) => ({ id })) } },
  });
}

// function that delete all the interests of a user and then add the new ones
// this is a workaround for the fact that prisma doesn't support updating a many-to-many relationship

export async function interestUpdateFromProfile(
  id: User["id"],
  interests: Interests["id"][]
) {
  const getUserInterests = await prisma.user
    .findUnique({ where: { id } })
    .interests();

  const interestsToDelete = getUserInterests?.map((interest) => interest.id);

  await prisma.user.update({
    where: { id },
    data: {
      interests: { disconnect: interestsToDelete?.map((id) => ({ id })) },
    },
  });

  return prisma.user.update({
    where: { id },
    data: { interests: { connect: interests.map((id) => ({ id })) } },
  });
}
