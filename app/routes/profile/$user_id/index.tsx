import {
  Autocomplete,
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { redirect } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/session.server";
import { getAllInterests, getUserInterests } from "~/models/interests.server";
import {
  getAllRestaurants,
  getUserRestaurants,
} from "~/models/restaurants.server";
import { getUserById } from "~/models/user.server";

export const loader = async ({ request }: any) => {
  const loggedInUser = await getUser(request);

  if (!loggedInUser) {
    return redirect("/login");
  }

  // get the last url segment
  const profileUserId = request.url.split("/").pop();

  if (!profileUserId) {
    return redirect("/dashboard");
  }

  const user = await getUserById(profileUserId);

  const userInterests = await getUserInterests(user.id);
  const userInterestsIds = userInterests?.map((interest) => interest.id) || [];
  const userRestaurants = await getUserRestaurants(user.id);
  const userRestaurantsIds =
    userRestaurants?.map((restaurant) => restaurant.id) || [];

  const allInterests = await getAllInterests();
  const allRestaurants = await getAllRestaurants();

  return {
    user,
    userInterestsIds,
    userRestaurantsIds,
    allInterests,
    allRestaurants,
  };
};

export default function Profile() {
  const {
    user,
    userInterestsIds,
    userRestaurantsIds,
    allInterests,
    allRestaurants,
  } = useLoaderData();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h5" variant="h5">
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Typography component="h6" variant="h6">
                Name: {user.first_name + " " + user.last_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography component="h6" variant="h6">
                Email: {user.email}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography component="h6" variant="h6">
                Bio: {user.bio}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography component="h5" variant="h5">
                Preferences
              </Typography>
            </Grid>

            {allInterests.map((interest: any) => {
              return (
                <Grid item xs={12} sm={6} key={interest.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userInterestsIds.includes(interest.id)}
                        name="interests"
                        value={interest.id}
                      />
                    }
                    label={interest.name}
                  />
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={[]}
                value={userRestaurantsIds.map((id: any) => {
                  return {
                    id,
                    name: allRestaurants.find(
                      (restaurant: any) => restaurant.id === id
                    ).name,
                  };
                })}
                multiple
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Their favorite restaurants"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
