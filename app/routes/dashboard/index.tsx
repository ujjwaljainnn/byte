// file: app/routes/dashboard.js

import { useLoaderData } from "@remix-run/react";
import { authenticator } from "app/services/auth.server";
import { Box, Container, Link, Paper, Typography } from "@mui/material";
import { getUserById } from "~/models/user.server";
import { getUserId } from "~/session.server";

import React, { useState } from "react";
import { getMeetupMatch, getUserMeetups } from "~/models/meetup.server";
import { getRestaurant } from "~/models/restaurants.server";

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

  if (!meetups) {
    return {
      user,
      meetups,
    };
  }
  return {
    user,
    meetups,
  };
};

const Dashboard = () => {
  // getting user from loader data
  const { user, meetups } = useLoaderData();

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
          Welcome, {user.first_name}!
        </Typography>
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
            Time until you get the next match:{" "}
            {Math.floor(timeToNextSunday / 86400)} days,{" "}
            {Math.floor((timeToNextSunday % 86400) / 3600)} hours,{" "}
            {Math.floor((timeToNextSunday % 3600) / 60)} minutes,{" "}
            {timeToNextSunday % 60} seconds
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
