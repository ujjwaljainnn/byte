import React, { useEffect, useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import { ActionArgs, json, redirect } from "@remix-run/server-runtime";

import { findOrCreateUser } from "~/models/user.server";

import { authenticator } from "~/services/auth.server";
import CloseIcon from "@mui/icons-material/Close";

const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export const loader = async ({ request }: any) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return {
    user,
  };
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

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

  return findOrCreateUser(user._json.email || "", password).then((user) => {
    if (user) {
      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": `user=${user.id}`,
        },
      });
    }
  });
}

export default function SetPassword() {
  const actionData = useActionData<typeof action>();
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (actionData?.errors) {
      setErrors(actionData.errors.password);
      setOpen(true);
    }
  }, [actionData]);

  return (
    <Box style={CONTAINER_STYLES}>
      <Form method="post">
        <TextField
          required
          id="outlined-required"
          label="Password"
          name="password"
          type="password"
        />
        <br />
        <TextField
          required
          id="outlined-required"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
        />
        <br />
        <Button type="submit">Submit</Button>
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
  );
}
