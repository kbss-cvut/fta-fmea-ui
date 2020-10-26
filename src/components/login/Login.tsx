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
import useStyles from "@components/login/Login.styles";
import * as userService from "@services/userService";
import {Alert} from "@material-ui/lab";
import {Link as RouterLink} from "react-router-dom";
import {useLoggedUser} from "@hooks/useLoggedUser";
import {useForm} from "react-hook-form";
import {schema} from "@components/login/Login.schema";

const Login = () => {
    const classes = useStyles();

    const [_, setLoggedUser] = useLoggedUser();

    const {register, handleSubmit, errors} = useForm({
        resolver: schema
    });

    const [loginFailed, setLoginFailed] = useState(false)
    const [loggingIn, setLoggingIn] = useState(false)

    const onSubmit = async (values: any) => {
        setLoggingIn(true)
        setLoginFailed(false)

        const loginResponse = await userService.login({
            username: values.username,
            password: values.password
        })

        if (!loginResponse) {
            setLoginFailed(true)
        } else {
            setLoggedUser({
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
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        inputRef={register}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                    />
                    <TextField
                        inputRef={register}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        disabled={loggingIn}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <MaterialLink variant="body2" component={RouterLink} to={"/register"}>
                                Don't have an account? Sign Up
                            </MaterialLink>
                        </Grid>
                    </Grid>
                    {
                        loginFailed &&
                        <Alert className={classes.alert} severity="error">Login failed, please try again.</Alert>
                    }
                </form>
            </div>
        </Container>
    );
}

export default Login;