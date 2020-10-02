import * as React from "react";
import {makeStyles, Button, Paper, TextField, Grid, FormControlLabel, Checkbox, Box} from "@material-ui/core";
import {Face} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    },
    box: {
        display: 'flex'
    },
    paper: {
        elevation: 3,
        padding: theme.spacing(3),
        margin: 'auto'
    }
}));

const Login = () => {
    const classes = useStyles();
    return (
        <Box className={classes.box}>
            <Paper className={classes.paper}>
                <div className={classes.margin}>
                    <Grid container justify="center">
                        <Grid item>
                            <Face/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="email" fullWidth autoFocus required/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Password" type="password" fullWidth required/>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{marginTop: '10px'}}>
                        <Button variant="outlined" color="primary" style={{textTransform: "none"}}>Login</Button>
                    </Grid>
                </div>
            </Paper>
        </Box>
    );
}

export default Login;