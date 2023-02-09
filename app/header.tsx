import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useOptionalUser } from "./utils";
import { Button, Link, styled } from "@mui/material";
import { useLocation } from "react-router-dom";
import { User, UserType } from "@prisma/client";
import { authenticator } from "./services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { getUserByEmail } from "./models/user.server";

// make loader function
export const loader = async ({ request }: any) => {
  user = await getUserByEmail(user._json.email || "");
  return {
    user,
  };
};

const HeaderItem = ({ title, link }: { title: string; link: string }) => {
  // get current path the page is on
  const currentPath = useLocation()?.pathname;

  return (
    <Button
      sx={{
        backgroundColor: link.startsWith(currentPath)
          ? "#202937"
          : "transparent",
      }}
    >
      <Link href={link} sx={{ color: "#fff", textDecoration: "none" }}>
        {title}
      </Link>
    </Button>
  );
};

const LogOutButton = () => {
  const onClick = () => {
    // send post request to logout
    fetch("/logout", {
      method: "POST",
    }).then(() => {
      window.location.replace("/");
    });
  };

  return (
    <Button onClick={onClick} sx={{ color: "#fff" }}>
      Logout
    </Button>
  );
};

const HEADER_ITEMS = [{ title: "Dashboard", link: "/dashboard" }];

const LoggedInHeaderItems = ({ user }: { user: User }) => {
  return (
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        {HEADER_ITEMS.map(({ title, link }) => (
          <HeaderItem title={title} link={link} key={title} />
        ))}

        {user.accountType === UserType.ADMIN && (
          <HeaderItem title={"Programs"} link={"/programs"} key={"Programs"} />
        )}

        <LogOutButton />
      </Box>
    </>
  );
};

const LoggedOutHeaderItems = () => {
  return (
    <>
      <HeaderItem title="Register" link="/join" />
      <HeaderItem title="Login" link="/login" />
    </>
  );
};

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Header() {
  const user = useOptionalUser();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" component="nav">
        <Toolbar>
          <Link href="/dashboard" style={{ flexGrow: "1" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block" },
                color: "#fff",
              }}
            >
              Byte
            </Typography>
          </Link>

          {user ? (
            <LoggedInHeaderItems user={user} />
          ) : (
            <LoggedOutHeaderItems />
          )}
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}
