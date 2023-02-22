import type { Interests, MeetupInfo, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getAllMeetups() {
  return prisma.meetupInfo.findMany();
}

export async function getMeetup(id: MeetupInfo["id"]) {
  return prisma.meetupInfo.findUnique({ where: { id } });
}

// function that fethes all the meetups of a user
export async function getUserMeetups(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } }).meetups();
}

// function that creates a meetup
export async function createMeetup(id: User["id"], meetup: MeetupInfo) {
  return prisma.meetupInfo.create({
    data: {
      ...meetup,
      users: { connect: { id } },
    },
  });
}

// function that updates a meetup
export async function updateMeetup(id: MeetupInfo["id"], meetup: MeetupInfo) {
  return prisma.meetupInfo.update({
    where: { id },
    data: meetup,
  });
}

// function that deletes a meetup
export async function deleteMeetup(id: MeetupInfo["id"]) {
  return prisma.meetupInfo.delete({ where: { id } });
}

// function that fetches the other user of a meetup (the one that is not the current user)
export async function getMeetupMatch(
  id: User["id"],
  meetupId: MeetupInfo["id"]
) {
  return prisma.meetupInfo
    .findUnique({ where: { id: meetupId } })
    .users({ where: { id: { not: id } } });
}
