import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    Grid, Link as MaterialLink,
    TextField,
    Typography
} from "@mui/material";
import * as React from "react";
import useStyles from "@components/register/Register.styles";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useState} from "react";
import * as userService from "@services/userService";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import withRouter from "@utils/withRouter";
import {useForm} from 'react-hook-form';
import {schema} from "@components/register/Register.schema";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import { yupResolver } from "@hookform/resolvers/yup";
import {ROUTES} from "@utils/constants";

const Register = () => {
    const { classes } = useStyles();
    const history = useNavigate();

    const [showSnackbar] = useSnackbar()

    const [registering, setRegistering] = useState(false)

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (values: any) => {
        setRegistering(true)

        userService.register({
            username: values.username,
            password: values.password
        }).then(value => {
            history(ROUTES.LOGIN);
        }).catch(reason => {
            setRegistering(false)
            showSnackbar(reason, SnackbarType.ERROR)
        })
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register("username")}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                variant="outlined"
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                variant="outlined"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register("passwordConfirmation")}
                                error={!!errors.passwordConfirmation}
                                helperText={errors.passwordConfirmation?.message}
                                variant="outlined"
                                fullWidth
                                name="passwordConfirmation"
                                label="Confirm Password"
                                type="password"
                                id="passwordConfirmation"
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        disabled={registering}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <MaterialLink variant="body2" component={RouterLink} to={ROUTES.LOGIN}>
                                Already have an account? Sign in
                            </MaterialLink>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

export default withRouter(Register);