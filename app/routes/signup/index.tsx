// file: app/routes/index.js

import { Box, Container, Grid } from "@mui/material";
import React, { Component } from 'react';
import { Form, useSearchParams } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { ErrorMessage } from "../login";
import { fontSize } from "@mui/system";

const CONTAINER_STYLES = {
  width: "100%",
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

const mystyle = {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: "30px",
  };


export default function SignUp() {

  const [searchParams] = useSearchParams();
  return (
    <Container style = {CONTAINER_STYLES}>     
        <h1 style={mystyle}>Sign Up</h1>
    </Container>
  );
}
