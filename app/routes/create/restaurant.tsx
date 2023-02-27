import { Form, useActionData } from "@remix-run/react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { getUser } from "~/session.server";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createRestaurant } from "~/models/restaurants.server";
import { useEffect, useState } from "react";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  if (user.accountType !== "ADMIN") {
    return redirect("/dashboard");
  }

  return {
    user,
  };
}

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  if (user.accountType !== "ADMIN") {
    return redirect("/dashboard");
  }

  const formData = await request.formData();

  const restaurantName = formData.get("restaurantName");

  if (typeof restaurantName !== "string") {
    return json({ error: "Invalid restaurant name" }, { status: 400 });
  }

  // create restaurant
  await createRestaurant(restaurantName);

  // send action data
  return json({ success: true });
}

export default function CreateRestaurant() {
  // get action data
  const actionData = useActionData();

  const [open, setOpen] = useState(false);

  const [restaurant, setRestaurant] = useState("");

  useEffect(() => {
    if (actionData?.success) {
      setOpen(true);
      setRestaurant("");
    }
  }, [actionData]);

  return (
    <Box className="h-full bg-gray-100" style={{ padding: "3%" }}>
      <Paper
        style={{
          margin: "auto",
          padding: "5%",
        }}
      >
        <Form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "80%",
            margin: "auto",
          }}
          method="post"
          encType="multipart/form-data"
        >
          <Typography
            margin="auto"
            variant="h4"
            component="h4"
            fontFamily="Roboto"
          >
            Create a Restaurant
          </Typography>
          <Box sx={{ fontStyle: "italic" }}>Restaurant Name: </Box>

          <TextField
            id="restaurant-name"
            label="Restaurant Name"
            name="restaurantName"
            variant="outlined"
            onChange={(e) => {
              setRestaurant(e.target.value);
            }}
            value={restaurant}
            required
            sx={{ width: "100%" }}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Form>
      </Paper>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Restaurant created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
