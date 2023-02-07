// file: app/services/auth.server.js

import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";

//make a loader function

// callback function that will be invoked upon successful authentication from social provider
async function handleSocialAuthCallback({ profile }) {
  return profile;
}

// Create an instance of the authenticator
// It will take session stor  age as an input parameter and creates the user session on successful authentication
export const authenticator = new Authenticator(sessionStorage);

// Configuring Google Strategy
authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["openid email profile"],
      callbackURL: `http://localhost:3000/auth/${SocialsProvider.GOOGLE}/callback`,
    },
    handleSocialAuthCallback
  )
);
