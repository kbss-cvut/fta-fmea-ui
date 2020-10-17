import * as React from "react";
import {
    Button,
    TextField,
    Grid,
    Container,
    Typography,
    CssBaseline,
    Avatar
} from "@material-ui/core";
import {Link as MaterialLink} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {FormEvent, useContext, useState} from "react";
import UserContext from "../../contexts/UserContext";
import useStyles from "@components/login/Login.styles";
import * as userService from "@services/userService";
import {Alert} from "@material-ui/lab";
import {Link as RouterLink} from "react-router-dom";

const Login = () => {
    const classes = useStyles();

    const {setUser} = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={(e) => handleSubmit(e, setUser)} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                        onChange={e => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        {
                            credentialsInvalid &&
                            <Grid item xs>
                                <Alert className={classes.alert} severity="error">Invalid Credentials</Alert>
                            </Grid>
                        }
                        <Grid item>
                            <MaterialLink variant="body2" component={RouterLink} to={"/register"}>
                                Don't have an account? Sign Up
                            </MaterialLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

export default Login;