// file: app/routes/index.js

import { Form } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";

const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
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
  return (
    <Form
      method="post"
      action={`/auth/${SocialsProvider.GOOGLE}`}
      style={CONTAINER_STYLES}
    >
      <button style={BUTTON_STYLES}>Login with Google</button>
    </Form>
  );
}
