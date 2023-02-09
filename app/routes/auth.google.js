// file: app/routes/auth.google.js

import { authenticator } from "../services/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";

export const action = async ({ request }) => {
  // initiating authentication using Google Strategy
  // on success --> redirect to dasboard
  // on failure --> back to homepage/login
  return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/pathway",
    failureRedirect: "/",
  });
};
