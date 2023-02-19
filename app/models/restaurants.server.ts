import type { Restaurant, User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getAllRestaurants() {
  return prisma.restaurant.findMany();
}

export async function getRestaurant(id: Restaurant["id"]) {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function createUserRestaurantPreferences(
  id: User["id"],
  restaurants: Restaurant["id"][]
) {
  return prisma.user.update({
    where: { id },
    data: { restaurants: { connect: restaurants.map((id) => ({ id })) } },
  });
}

export async function getUserRestaurants(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } }).restaurants();
}

// function that delete all the restaurants of a user and then create new ones
// this is a workaround for the fact that prisma doesn't support updating a many-to-many relationship

export async function updateUserRestaurantPreferences(
  id: User["id"],
  restaurants: Restaurant["id"][]
) {
  const userRestaurants = await getUserRestaurants(id);

  const restaurantsToDelete = userRestaurants?.map(
    (restaurant) => restaurant.id
  );

  await prisma.user.update({
    where: { id },
    data: {
      restaurants: { disconnect: restaurantsToDelete?.map((id) => ({ id })) },
    },
  });

  return prisma.user.update({
    where: { id },
    data: { restaurants: { connect: restaurants.map((id) => ({ id })) } },
  });
}
