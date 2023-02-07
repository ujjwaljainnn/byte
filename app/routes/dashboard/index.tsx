// file: app/routes/dashboard.js

import { Form, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";

import { authenticator } from "app/services/auth.server";
import { getUserByEmail } from "~/models/user.server";

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
  // authenticator.isAuthenticated function returns the user object if found
  // if user is not authenticated then user would be redirected back to homepage ("/" route)
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  // check if user email exists in database
  const userExists = await getUserByEmail(user?._json.email);

  if (!userExists) {
    // send to set password page
    return redirect("/setpassword", {
      headers: {
        email: user?._json.email,
      },
    });
  }

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
      <p>{user.displayName}</p>
      <Form action="/logout" method="post">
        <button style={BUTTON_STYLES}>Logout</button>
      </Form>
    </div>
  );
};

export default Dashboard;
