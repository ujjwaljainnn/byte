import { authenticator } from "~/services/auth.server";

import React, { useEffect, useState } from "react";

import { createUser } from "~/models/user.server";
import Link from '@mui/material/Link';

import {
  Alert,
  Autocomplete,
  Avatar,
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
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import CloseIcon from "@mui/icons-material/Close";
import { StudentStanding } from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import {
  getAllInterests,
  createUserInterests,
} from "~/models/interests.server";
import {
  getAllRestaurants,
  createUserRestaurantPreferences,
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
  const instagram = formData.get("instagram");
  const phone = formData.get("phone");
  const snapchat = formData.get("snapchat");

  if (
    typeof instagram !== "string" ||
    typeof phone !== "string" ||
    typeof snapchat !== "string"
  ) {
    return json(
      { errors: { email: null, password: "Some error occured. Try again!" } },
      { status: 400 }
    );
  }

  // validate phone number
  if (phone.length > 0 && !/^\d{10}$/.test(phone)) {
    return json(
      { errors: { email: null, password: "Invalid phone number" } },
      { status: 400 }
    );
  }

  // either instagram, snapchat, or phone number must be provided
  if (instagram.length === 0 && snapchat.length === 0 && phone.length === 0) {
    return json(
      { errors: { email: null, password: "Provide at least one contact" } },
      { status: 400 }
    );
  }

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

  console.log("restaurants", restaurants);

  const restaurantIds = restaurants.map((restaurant: any) => restaurant.id);
  const interestIds = interests.map((interest) => interest.toString());

  console.log("interestIds", interestIds);
  console.log("restaurantIds", restaurantIds);


  const newUser = await createUser({
    email: user._json.email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    bio,
    standing: standing,
  });

  if (newUser) {
    await createUserInterests(newUser.id, interestIds);
    await createUserRestaurantPreferences(newUser.id, restaurantIds);

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
  const [restaurantsList, setRestaurantsList] = useState([]);

  const submit = useSubmit();

  useEffect(() => {
    if (actionData?.errors) {
      setErrors(actionData.errors.password);
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
        <Typography sx={{ mb: 2 }} component="h3" variant="h3"> Create your profile </Typography>
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
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  multiple= {false}
                  type="file"
                />
                <label htmlFor="contained-button-file">
                  <IconButton>
                    <Avatar
                      src="/images/blankprofile.svg"
                      style={{
                        margin: "10px",
                        width: "60px",
                        height: "60px",
                      }}
                    />
                  </IconButton>
                </label>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="instagram"
                  label="Instagram"
                  id="instagram"
                  rows={2}
                  autoComplete="instagram"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone"
                  id="phone"
                  rows={2}
                  autoComplete="phone"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="snapchat"
                  label="Snapchat"
                  id="snapchat"
                  rows={2}
                  autoComplete="snapchat"
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
                  // options should be the restaurants minus the ones the user already selected
                  options={restaurants.filter(
                    (restaurant: any) => !restaurantsList.includes(restaurant)
                  )}
                  multiple
                  onChange={(event, newValue) => {
                    setRestaurantsList(newValue);
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

            <Grid container justifyContent="center">
              <Typography align="center" variant="h6"> Already have an account? <Link color="primary" href="/login">Log in</Link></Typography>
            </Grid>
          </Box>
          {/* <input type="hidden" name="redirectTo" value={redirectTo} /> */}
        </Form>
      </Box>
    </Container>
  );
}
