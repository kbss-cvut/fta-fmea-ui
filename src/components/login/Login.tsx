import * as React from "react";
import {Button, Paper, TextField, Grid, Container, Typography} from "@material-ui/core";
import {Face} from '@material-ui/icons'
import {FormEvent, useContext, useState} from "react";
import UserContext from "../../contexts/UserContext";
import useStyles from "@components/login/Login.styles";
import userService from "@services/userService";
import {Alert} from "@material-ui/lab";
import {Link} from "react-router-dom";

const Login = () => {
    const classes = useStyles();

    const {setUser} = useContext(UserContext);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [credentialsInvalid, setCredentialsInvalid] = useState(false);

    const handleSubmit = async (e: FormEvent, setUser: Function) => {
        e.preventDefault();

        // TODO progress bar
        const loginResponse = await userService.login({
            username: username,
            password: password
        })

        if (!loginResponse) {
            setCredentialsInvalid(true);
        } else {
            setUser({
                username: loginResponse.username,
                token: loginResponse.token,
                authenticated: true
            })
        }
    }

    return (
        <Container className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h4">Login</Typography>
                <form onSubmit={(e) => handleSubmit(e, setUser)}>
                    <Grid container justify="center">
                        <Grid item>
                            <Face/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="text"
                                       onChange={e => setUsername(e.target.value)} fullWidth autoFocus
                                       required/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="password" label="Password" type="password"
                                       onChange={e => setPassword(e.target.value)} fullWidth required/>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{marginTop: '10px'}}>
                        <Button type="submit" variant="outlined" color="primary"
                                style={{textTransform: "none"}}>Login</Button>
                    </Grid>
                    {
                        credentialsInvalid &&
                        <Alert className={classes.alert} severity="error">Invalid Credentials</Alert>
                    }
                </form>

                <Link to="/register" className={classes.link}>Not registered yet?</Link>
            </Paper>
        </Container>
    );
}

export default Login;