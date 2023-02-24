import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "app/services/auth.server";
import { getUserById, User } from "~/models/user.server";
import { getUserId } from "~/session.server";

import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Person2Icon from "@mui/icons-material/Person2";
import SchoolIcon from "@mui/icons-material/School";

import EmailIcon from "@mui/icons-material/Email";
import { Instagram } from "@mui/icons-material";

export const loader = async ({ request }: any) => {
  // fetch user id from session
  const userId = await getUserId(request);

  if (!userId) {
    // if no, redirect to login
    return authenticator.logout(request, {
      redirectTo: "/login",
    });
  }

  // fetch user data from database
  const user = await getUserById(userId);

  return {
    user,
  };
};

type Anchor = "top" | "left" | "bottom" | "right";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const { user } = useLoaderData();

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 450 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box component="img" src={require("public/images/face2.jpg")} />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Person2Icon />
            </ListItemIcon>
            <ListItemText>
              Name: {user.first_name} {user.last_name}
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText>Year: {user.standing}</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText>Email: {user.email}</ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Instagram />
            </ListItemIcon>
            <ListItemText>{user.instagram_username}</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      <Typography
        align="center"
        sx={{
          mt: 2,
        }}
      >
        <Button>
          <Link color="primary" to={"/profile"}>
            Edit Profile
          </Link>
        </Button>
      </Typography>
    </Box>
  );

  return (
    <div>
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(anchor, true)}
            sx={{ mr: 2, ml: 4 }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
