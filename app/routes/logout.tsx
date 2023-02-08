// import type { ActionArgs } from "@remix-run/node";
// import { redirect } from "@remix-run/node";

// import { logout } from "~/session.server";

// export async function action({ request }: ActionArgs) {
//   return logout(request);
// }

// export async function loader() {
//   return redirect("/");
// }

// file: app/routes/logout.js

import { ActionArgs } from "@remix-run/server-runtime";
import { authenticator } from "../services/auth.server.js";

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
