import {
    Button,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import * as React from "react";
import useStyles from "@components/register/Register.styles";
import {useState} from "react";
import * as userService from "@services/userService";
import {useNavigate} from "react-router-dom";
import {useForm} from 'react-hook-form';
import {schema} from "@components/register/Register.schema";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import { yupResolver } from "@hookform/resolvers/yup";
import {ROUTES} from "@utils/constants";
import {DashboardTitleProps} from "@components/dashboard/DashboardTitleProps";

const CreateUser = ({setAppBarName}: DashboardTitleProps) => {
    const { classes } = useStyles();
    const history = useNavigate();

    const [showSnackbar] = useSnackbar()

    const [registering, setRegistering] = useState(false)

    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (values: any) => {
        setRegistering(true)
       
        userService.register({
            username: values.username,
            password: values.password
        }).then(value => {
            setRegistering(false);
            history(ROUTES.ADMINISTRATION);
            showSnackbar("User successfully created.", SnackbarType.SUCCESS)
            reset()           
        }).catch(reason => {
            setRegistering(false)
            showSnackbar(reason, SnackbarType.ERROR)
        })
    };

    return (
        <React.Fragment>
            <Typography component="h3" variant="h5">
                Create user
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            inputRef={register}
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
                            inputRef={register}
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
                            inputRef={register}
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
                    Create user
                </Button>
            </form>
        </React.Fragment>
    );
}

export default CreateUser;