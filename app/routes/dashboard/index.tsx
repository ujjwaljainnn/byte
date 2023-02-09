// file: app/routes/dashboard.js

import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "app/services/auth.server";
import { getUserById } from "~/models/user.server";
import { getUserId } from "~/session.server";

const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
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

  return {
    user,
  };
};

const Dashboard = () => {
  // getting user from loader data
  const { user } = useLoaderData();

  // displaying authenticated user data
  return (
    <div style={CONTAINER_STYLES}>
      <h1>You are LoggedIn</h1>
      <h2>{user.email}</h2>
      <Form action="/logout" method="post">
        <button style={BUTTON_STYLES}>Logout</button>
      </Form>
    </div>
  );
};

export default Dashboard;
