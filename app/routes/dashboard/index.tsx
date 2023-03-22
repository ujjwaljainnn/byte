// file: app/routes/dashboard.js

import { useLoaderData, Form } from "@remix-run/react";
import { authenticator } from "app/services/auth.server";
import { Box, Button, Container, Divider, Grid, Link, List, ListItem, ListItemText, ListSubheader, Paper, Stack, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { getUserById } from "~/models/user.server";
import { getUserId } from "~/session.server";

import React, { useState } from "react";
import { getMeetupMatch, getUserMeetups, updateMeetupStatus } from "~/models/meetup.server";
import { getRestaurant } from "~/models/restaurants.server";
import { ActionArgs, json, redirect } from "@remix-run/server-runtime";
import { MeetupStatus } from "@prisma/client";

export const loader = async ({ request }: any) => {
  // fetch user id from session
  const userId = await getUserId(request);

  if (!userId) {
    // if no, redirect to login
    return authenticator.logout(request, {
      redirectTo: "/login?email_already_exists=true",
    });
  }

  // fetch user data from database
  const user = await getUserById(userId);

  const meetups = await getUserMeetups(userId);

  console.log("meetups", meetups);

  if (meetups?.length === 0 || !meetups) {
    console.log("no meetups");
    return {
      user,
      meetups,
    };
  }

  const match = await getMeetupMatch(userId, meetups ? meetups[0].id : "0");

  if (!match) {
    return {
      user,
      meetups: [],
    };
  }

  const restaurant_name_meetup = await getRestaurant(
    meetups ? meetups[0].restaurantId : "0"
  );

  return {
    user,
    meetups,
    match,
    restaurant_name_meetup,
  };
};

export async function action({ request }: ActionArgs) {

  const user = await getUserId(request);

  if (!user) {
    return redirect("/login");
  }

  const formData = await request.formData();

  const updateMeetup = formData.get("changeMeetupStatus");
  const currentMeetup = formData.get("currentMeetup");

  console.log("updateMeetup", updateMeetup);
  console.log("currentMeetup", currentMeetup);

  // return json({});
  if (updateMeetup === "complete") {
    return await updateMeetupStatus(currentMeetup, MeetupStatus["COMPLETED"]);
  }
  else if (updateMeetup === "canceled") {
    return await updateMeetupStatus(formData.get("currentMeetup"), "CANCELLED");
  }
  else {
    return await updateMeetupStatus(formData.get("currentMeetup"), "PENDING");
  }
}

const Dashboard = () => {
  // getting user from loader data
  const { user, meetups, match, restaurant_name_meetup } = useLoaderData();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.h2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  // make a timer that shows time to upcoming Sunday 6:00 PM in hours and minutes
  const now = new Date();
  const nextSunday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + ((7 - now.getDay()) % 7),
    12,
    0,
    0
  );

  // make a state variable that holds the time to next Sunday 6:00 PM in days, hours, minutes and seconds
  const [timeToNextSunday, setTimeToNextSunday] = useState(
    Math.floor((nextSunday.getTime() - now.getTime()) / 1000)
  );

  // useEffect to update the timeToNextSunday state variable every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeToNextSunday((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToNextSunday]);

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >

        <Typography component="h1" variant="h3">
          Welcome, {user.first_name ? user.first_name : "user"}!
        </Typography>

        <div>
          <Typography sx={{ marginTop: 10 }} align="center" component="h1" variant="h5"> Time until you get the next match: </Typography>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={4}
            sx={{
              marginTop: 2,
              padding: 2,
            }}
          >
            <Item>{Math.floor(timeToNextSunday / 86400)}</Item>
            <Item>{Math.floor((timeToNextSunday % 86400) / 3600)}</Item>
            <Item>{Math.floor((timeToNextSunday % 3600) / 60)}</Item>
            <Item>{timeToNextSunday % 60}</Item>
          </Stack>
        </div>
        <div>
          <Stack direction="row" spacing={10} >
            <Typography variant="h6">Days</Typography>
            <Typography variant="h6">Hours</Typography>
            <Typography variant="h6">Minutes</Typography>
            <Typography variant="h6">Seconds</Typography>
          </Stack>
        </div>
        {meetups.length > 0 ? (
          <Paper
            sx={{
              marginTop: 2,
              padding: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Your next match is:{" "}
              <Link href={`/profile/${match[0].id}`}>
                {match[0].first_name + " " + match[0].last_name}
              </Link>{" "}
              at {restaurant_name_meetup.name}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item textAlign="center">
                <Form method="post">
                  <input type="hidden" name="changeMeetupStatus" value="complete" />
                  <input type="hidden" name="currentMeetup" value={meetups[0].id} />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={meetups[0].status === "COMPLETED"}
                  >
                    Complete
                  </Button>
                </Form>
              </Grid>
              <Grid item textAlign="center">
                <Form method="post">
                  <input type="hidden" name="changeMeetupStatus" value="canceled" />
                  <input type="hidden" name="currentMeetup" value={meetups[0].id} />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={meetups[0].status === "CANCELLED"}

                  >
                    Canceled
                  </Button>
                </Form>
              </Grid>
              <Grid item textAlign="center">
                <Form method="post">
                  <input type="hidden" name="changeMeetupStatus" value="pending" />
                  <input type="hidden" name="currentMeetup" value={meetups[0].id} />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={meetups[0].status === "PENDING"}
                  >
                    Pending
                  </Button>
                </Form>
              </Grid>
            </Grid>
          </Paper>
        ) : (


          <Paper
            sx={{
              marginTop: 5,
              padding: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              subheader={<ListSubheader>Your upcoming meetups:</ListSubheader>}
            >
              <ListItem>
                <ListItemText primary="No upcoming meetups" />
              </ListItem>
            </List>
          </Paper>

        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
