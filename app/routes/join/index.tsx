// file: app/routes/index.js

import { Box, Container, Grid } from "@mui/material";
import { Form, useSearchParams } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";

import { ErrorMessage } from "../login";

const CONTAINER_STYLES = {
  width: "100%",
  height: "50vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const BUTTON_STYLES = {
  padding: "15px 25px",
  background: "#dd4b39",
  border: "0",
  outline: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
};

export default function Join() {
  const [searchParams] = useSearchParams();
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
        }}
      >
        {searchParams.get("error") === "notVanderbiltEmail" && (
          <ErrorMessage
            error="Invalid email! Only Vanderbilt emails accepted."
            subError="Please register using Vanderbilt email."
          />
        )}
        <Form
          method="post"
          action={`/auth/${SocialsProvider.GOOGLE}`}
          style={CONTAINER_STYLES}
        >
          <button style={BUTTON_STYLES}>Login with Google</button>
        </Form>
      </Box>
    </Container>
  );
}
