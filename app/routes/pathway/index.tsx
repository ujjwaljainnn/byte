import { redirect } from "@remix-run/server-runtime";
import { getUserByEmail } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: any) => {
  // authenticating user
  const googleAuthUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (/@vanderbilt.edu\s*$/.test(googleAuthUser._json.email) === false) {
    return authenticator.logout(request, {
      redirectTo: "/join?error=notVanderbiltEmail",
    });
  }

  const user = await getUserByEmail(googleAuthUser._json.email);

  if (!user) {
    // if yes, redirect to dashboard
    return redirect("/join/createprofile");
  }

  return redirect("/dashboard");
};
