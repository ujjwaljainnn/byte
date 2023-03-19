import {
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { UserType } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { getUser } from "~/session.server";
import { getAllMeetups } from "~/models/meetup.server";
import React from "react";
import { Link } from "@mui/material";

export const loader = async ({ request }: any) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  if (user.accountType === UserType.STUDENT) {
    return redirect("/dashboard");
  }

  const allMeetups = await getAllMeetups();

  return {
    allMeetups,
  };
};

export default function Meetups() {
  const { allMeetups } = useLoaderData();

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Meetups</Typography>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allMeetups.length > 0 &&
              allMeetups.map((meetup: any) => (
                <TableRow key={meetup.id}>
                  <TableCell>
                    {meetup.time.toLocaleString().slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    {meetup.users.map((user: any) => (
                      <Typography key={user.id}>
                        <Link href={`/profile/${user.id}`}>
                          {user.first_name} {user.last_name}
                        </Link>
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>{meetup.status}</TableCell>
                  <TableCell>
                    <Button>
                      <Link href={`/meetups/${meetup.id}`}>View Meetup</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Grid>
    </Container>
  );
}
