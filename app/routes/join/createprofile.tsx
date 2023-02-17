import { authenticator } from "~/services/auth.server";

import React, { useEffect, useState } from "react";

import { createUser } from "~/models/user.server";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  capitalize,
  Checkbox,
  Collapse,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ActionArgs, json } from "@remix-run/server-runtime";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import CloseIcon from "@mui/icons-material/Close";
import { StudentStanding } from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import {
  getAllInterests,
  updateUserInterests,
} from "~/models/interests.server";
import {
  getAllRestaurants,
  updateUserRestaurants,
} from "~/models/restaurants.server";

export const loader = async ({ request }: any) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const interests = await getAllInterests();

  const restaurants = await getAllRestaurants();

  return {
    user,
    interests,
    restaurants,
  };
};

export async function action({ request }: ActionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const formData = await request.formData();

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const bio = formData.get("bio");
  const standing = formData.get("standing");
  const interests = formData.getAll("interests");
  const restaurants = JSON.parse(formData.get("restaurants"));

  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { errors: { email: null, password: "First name is required" } },
      { status: 400 }
    );
  }

  if (typeof lastName !== "string" || typeof bio !== "string") {
    return json(
      { errors: { email: null, password: "Some error occured. Try again!" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return json(
      { errors: { email: null, password: "Passwords do not match" } },
      { status: 400 }
    );
  }

  const restaurantIds = restaurants.map((restaurant: any) => restaurant.id);
  const interestIds = interests.map((interest) => interest.toString());

  const newUser = await createUser({
    email: user._json.email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    bio,
    standing: standing,
  });

  if (newUser) {
    await updateUserInterests(newUser.id, interestIds);
    await updateUserRestaurants(newUser.id, restaurantIds);

    return authenticator.logout(request, {
      redirectTo: "/login?account_created_successfully=true",
    });
  } else {
    return json(
      { errors: { email: null, password: "Some error occured. Try again!" } },
      { status: 400 }
    );
  }
}

function StandingSelect() {
  return (
    <FormControl required>
      <Select
        labelId="demo-simple-select-label"
        aria-labelledby="standing-select"
        id="demo-simple-select"
        defaultValue={StudentStanding.FRESHMAN}
        name="standing"
      >
        {Object.values(StudentStanding).map((standing) => (
          <MenuItem value={standing} key={standing}>
            {capitalize(standing)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function CreateProfile() {
  const { user, interests, restaurants } = useLoaderData();

  const actionData = useActionData<typeof action>();
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = useState("");
  const [restaurantsList, setRestaurantsList] = useState({});

  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.errors) {
      setErrors(actionData.errors.password);
      setOpen(true);
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
        <Form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append("restaurants", JSON.stringify(restaurantsList));
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
                  defaultValue={user._json.given_name}
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  defaultValue={user._json.family_name}
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  id="outlined-required"
                  label="Password"
                  name="password"
                  type="password"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  id="outlined-required"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
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
                />
              </Grid>
              <Grid item xs={12}>
                <StandingSelect />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h5" variant="h5">
                  Preferences
                </Typography>
              </Grid>

              {interests.map((interest: any) => (
                <Grid item xs={12} key={interest.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="interests"
                        color="primary"
                        defaultChecked={false}
                        value={interest.id}
                      />
                    }
                    label={interest.name}
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Autocomplete
                  options={restaurants.map((restaurant: any) => {
                    return {
                      id: restaurant.id,
                      name: restaurant.name,
                    };
                  })}
                  multiple
                  onChange={(e: any, value: any) => {
                    setRestaurantsList(value);
                  }}
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
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Log in</Link>
              </Grid>
            </Grid>
          </Box>
          {/* <input type="hidden" name="redirectTo" value={redirectTo} /> */}
        </Form>
        <Collapse in={open}>
          <Alert
            severity="error"
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
            {errors}
          </Alert>
        </Collapse>
      </Box>
    </Container>
  );
}
