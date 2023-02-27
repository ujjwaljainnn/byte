import { Dangerous } from "@mui/icons-material";
import { Button, Container, Grid, Typography } from "@mui/material";
import { UserType } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { getUser } from "~/session.server";

export const loader = async ({ request }: any) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  return {
    user,
  };
};

export default function Create() {
  const { user } = useLoaderData();
  if (user.accountType === UserType.STUDENT) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Dangerous sx={{ fontSize: "10rem", color: "red" }} />

        <Typography variant="h4" sx={{ textAlign: "center" }}>
          This page is for admins only.
        </Typography>
      </Container>
    );
  }

  // button to create a new restaurant
  // button to create a new interest
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Create</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5">Restaurants</Typography>

          <Typography variant="body1">
            Create a new restaurant to add to the database.
          </Typography>

          <Button variant="contained" color="primary">
            <Link to="/create/restaurant">Create Restaurant</Link>
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5">Interests</Typography>

          <Typography variant="body1">
            Create a new interest to add to the database.
          </Typography>

          <Button variant="contained" color="primary">
            <Link to="/create/interest">Create Interest</Link>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
