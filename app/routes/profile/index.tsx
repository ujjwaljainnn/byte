import React, { useEffect, useState } from "react";

import { updateUser } from "~/models/user.server";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { json, redirect } from "@remix-run/server-runtime";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import CloseIcon from "@mui/icons-material/Close";
import { getUser } from "~/session.server";
import {
  getAllInterests,
  getUserInterests,
  interestUpdateFromProfile,
} from "~/models/interests.server";
import {
  getAllRestaurants,
  getUserRestaurants,
  updateUserRestaurantPreferences,
} from "~/models/restaurants.server";

export const loader = async ({ request }: any) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

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

export async function action({ request }: any) {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const bio = formData.get("bio");

  const interests = formData.getAll("interests");
  const restaurants = JSON.parse(formData.get("restaurants"));

  if (!firstName || !lastName || !interests.length || !restaurants.length) {
    return json(
      {
        errors: {
          password: "Please fill out all required fields",
        },
      },
      {
        status: 400,
      }
    );
  }

  const restaurantIds = restaurants.map((restaurant: any) => restaurant.id);

  await updateUser(user.id, {
    first_name: firstName,
    last_name: lastName,
    bio,
  });

  await interestUpdateFromProfile(user.id, interests);

  await updateUserRestaurantPreferences(user.id, restaurantIds);

  // on success, send a toast message
  return json(
    {
      message: "Profile updated successfully",
    },
    {
      status: 200,
    }
  );
}

export default function Profile() {
  const {
    user,
    userInterestsIds,
    userRestaurantsIds,
    allInterests,
    allRestaurants,
  } = useLoaderData();

  const actionData = useActionData<typeof action>();

  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const submit = useSubmit();

  // define a state variable restaurantList that only contains restaurants which ids exist in userRestaurantsIds
  const [restaurantList, setRestaurantList] = useState(
    allRestaurants.filter((restaurant: any) =>
      userRestaurantsIds.includes(restaurant.id)
    )
  );

  useEffect(() => {
    if (actionData?.errors) {
      setSuccess("");
      setErrors(actionData.errors.password);
      setOpen(true);
      // scroll to top
      window.scrollTo(0, 0);
    }
  }, [actionData]);

  useEffect(() => {
    if (actionData?.message) {
      setErrors("");
      setSuccess(actionData.message);
      setOpen(true);
      // scroll to top
      window.scrollTo(0, 0);
    }
  }, [actionData]);

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
        <Collapse in={open}>
          <Alert
            severity={errors ? "error" : "success"}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {errors || success}
          </Alert>
        </Collapse>

        <Typography component="h1" variant="h5">
          Edit Profile
        </Typography>

        <Form
          method="post"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            formData.append("restaurants", JSON.stringify(restaurantList));
            submit(formData, { method: "post", replace: true });
          }}
        >
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h5" variant="h5">
                  Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  defaultValue={user.first_name}
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  defaultValue={user.last_name}
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="bio"
                  label="Bio (optional)"
                  id="bio"
                  multiline
                  rows={2}
                  autoComplete="bio"
                  defaultValue={user.bio}
                />
              </Grid>
              <Grid item xs={12}></Grid>
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
                          defaultChecked={userInterestsIds.includes(
                            interest.id
                          )}
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
                  // options should be all restaurants minus the ones already selected and should be updated when restaurantList changes
                  options={allRestaurants.filter(
                    (restaurant: any) =>
                      !restaurantList
                        .map((restaurant: any) => restaurant.id)
                        .includes(restaurant.id)
                  )}
                  onChange={(event, newValue) => {
                    setRestaurantList(newValue);
                  }}
                  defaultValue={userRestaurantsIds.map((id: any) => {
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
                      label="Select restaurants you like"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Box>
        </Form>
      </Box>
    </Container>
  );
}
