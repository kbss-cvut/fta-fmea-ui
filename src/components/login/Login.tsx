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
import {useState} from "react";
import useStyles from "@components/login/Login.styles";
import * as userService from "@services/userService";
import {Link as RouterLink} from "react-router-dom";
import {useLoggedUser} from "@hooks/useLoggedUser";
import {useForm} from "react-hook-form";
import {schema} from "@components/login/Login.schema";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import { yupResolver } from "@hookform/resolvers/yup";
import {ROUTES} from "@utils/constants";

const Login = () => {
    const classes = useStyles();

    const [_, setLoggedUser] = useLoggedUser();
    const [showSnackbar] = useSnackbar()

    const {register, handleSubmit, errors} = useForm({
        resolver: yupResolver(schema)
    });

    const [loggingIn, setLoggingIn] = useState(false)

    const onSubmit = async (values: any) => {
        setLoggingIn(true)

        userService.login({
            username: values.username,
            password: values.password
        }).then(loginResponse => {
            setLoggedUser({
                iri: loginResponse.uri,
                username: loginResponse.username,
                token: loginResponse.token,
                authenticated: true,
                roles: loginResponse.roles
            })
        }).catch(reason => {
            setLoggingIn(false)
            showSnackbar(reason, SnackbarType.ERROR)
        })
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
                    {process.env.ADMIN_REGISTRATION_ONLY !== "true" && (
                        <Grid container>
                            <Grid item>
                                <MaterialLink variant="body2" component={RouterLink} to={ROUTES.REGISTER}>
                                    Don't have an account? Sign Up
                                </MaterialLink>
                            </Grid>
                        </Grid>
                    )}
                </form>
            </div>
        </Container>
    );
}

export default Login;