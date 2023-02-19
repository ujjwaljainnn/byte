import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser({
  email,
  password,
  first_name,
  last_name,
  bio,
  standing,
  profilePic = "",
}: {
  email: User["email"];
  password: string;
  first_name: User["first_name"];
  last_name: User["last_name"];
  standing: User["standing"];
  bio: User["bio"];
  profilePic: User["profilePic"];
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      first_name,
      last_name,
      standing,
      bio,
      profilePic,
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function findOrCreateUser(email: User["email"], password: string) {
  const user = await getUserByEmail(email);

  if (user) {
    return user;
  }

  return createUser(email, password);
}

export async function updateUser(
  id: User["id"],
  data: {
    first_name?: User["first_name"];
    last_name?: User["last_name"];
    bio?: User["bio"];
    standing?: User["standing"];
    profilePic?: User["profilePic"];
  }
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
