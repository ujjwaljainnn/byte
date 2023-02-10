import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';

function CardRow(props : {name: string, description: string}) {
  return (
    <Card sx={{ minWidth: 275, minHeight: 250 }}>
      <CardContent>
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          src={require("../../public/images/download.jpg")}
        />
        <Typography variant="h6" component="div" align="center" sx={{ my: 1}}>
          {props.name}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" align="center">
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <Grid style={{
      minWidth: "100%",
      height: "100vh",
    }}>
      <Grid container spacing={2} sx={{ my: 3 }} ml = {2}>
        <Grid item xs={8} md={6} >
          <Box sx={{ my: 5}}>
            <Typography variant="h3" gutterBottom align="left">
              About Byte
            </Typography>
            <Typography variant="h4" gutterBottom align="left">
              Bringing people together through food
            </Typography>
            <Typography variant="subtitle1" gutterBottom align="left">
              Recognizing that there are tons of great restaurants in Nashville but not enough people have an incentive to try them, 
              we at Byte aim to bring people together through food, allowing Vanderbilt students to meet new people who enjoy the 
              same restaurants by setting them up on a meal meetup. 
            </Typography>
            <Typography variant="subtitle1" gutterBottom align="left">
              Begin by registering for an account using your Vanderbilt email, and selecting a few restaurants you hope to try. 
              Byte will do the rest and you will be eating in no time.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={6}>
          <Box
            component="img"
            src={require("../../public/images/nashville.webp")}
          />
        </Grid>
      </Grid>
      <Grid mt={15}>
        <Box sx={{ my: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Meet the team
          </Typography>
        </Box>
        <Box sx={{ my: 4 }} >
          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid  item xs={3}>
              <Item>
                <CardRow name={"Kunal Kaushik"} description={"kunal description"}/>
              </Item>
            </Grid>
            <Grid  item xs={3}>
              <Item>
                <CardRow name={"Lucas Smulders"} description={"lucas description"}/>
              </Item>
            </Grid>
            <Grid  item xs={3}>
              <Item>
                <CardRow name={"Ujjwal Jain"} description={"ujjwal description"}/>
              </Item>
            </Grid>
            <Grid  item xs={3}>
              <Item>
                <CardRow name={"Nishant Jain"} description={"nishant description"}/>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}