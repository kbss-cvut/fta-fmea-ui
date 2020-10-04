import * as React from "react";
import {Button, Paper, TextField, Grid, Container} from "@material-ui/core";
import {Face} from '@material-ui/icons'
import {FormEvent, useContext, useState} from "react";
import UserContext from "../../contexts/UserContext";
import useStyles from "@components/login/Login.styles";
import userService from "@services/userService";

// TODO Register component

const Login = () => {
    console.log(process.env.BASE_API_URL)

    const classes = useStyles();

    const {setUser} = useContext(UserContext);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async (e: FormEvent, setUser: Function) => {
        e.preventDefault();

        // TODO progress bar
        // TODO pass setUser function to service?
        const loginResponse = await userService.login({
            username: username,
            password: password
        })

        // TODO handle errors?
        console.log(`loginResponse - ${JSON.stringify(loginResponse)}`)

        setUser({
            username: loginResponse.username,
            token: loginResponse.token,
            authenticated: true
        })
    }

    return (
        <Container className={classes.root}>
            <Paper className={classes.paper}>
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
                            <TextField id="username" label="Password" type="password"
                                       onChange={e => setPassword(e.target.value)} fullWidth required/>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{marginTop: '10px'}}>
                        <Button type="submit" variant="outlined" color="primary"
                                style={{textTransform: "none"}}>Login</Button>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;