import type { Restaurant, User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getAllRestaurants() {
  return prisma.restaurant.findMany();
}

export async function getRestaurant(id: Restaurant["id"]) {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function updateUserRestaurants(
  id: User["id"],
  restaurants: Restaurant["id"][]
) {
  return prisma.user.update({
    where: { id },
    data: { restaurants: { connect: restaurants.map((id) => ({ id })) } },
  });
}
