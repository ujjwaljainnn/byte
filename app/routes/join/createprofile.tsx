import { Box } from "@mui/material";
import { authenticator } from "~/services/auth.server";

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

export default function SetPassword() {
  return <Box style={CONTAINER_STYLES}>hello</Box>;
}
