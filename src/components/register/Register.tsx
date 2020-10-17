import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    Grid, Link as MaterialLink,
    TextField,
    Typography
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import * as React from "react";
import useStyles from "./Register.styles";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {FormEvent, useState} from "react";
import * as userService from "../../services/userService";
import {Link as RouterLink, Link, useHistory, withRouter} from "react-router-dom";

const Register = () => {
    const classes = useStyles();
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [alertMessage, setAlertMessage] = useState("Incorrect Data");
    const [alertVisible, showAlert] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            setAlertMessage("Passwords do not match!")
            showAlert(true);
            return;
        }

        const registerResponse = await userService.register({
            username: username,
            password: password
        });

        if (!registerResponse) {
            setAlertMessage("Registration Failed, try again!")
            showAlert(true);
            return;
        } else {
            console.log(`${JSON.stringify(registerResponse)}`)
            history.push("/login");
        }
    };

    // TODO validate inputs - empty values can be submitted now

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
                <form className={classes.form} noValidate onSubmit={(e) => handleSubmit(e)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="passwordConfirmation"
                                label="Confirm Password"
                                type="password"
                                id="passwordConfirmation"
                                autoComplete="current-password"
                                onChange={e => setPasswordConfirm(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <MaterialLink variant="body2" component={RouterLink} to={"/login"}>
                                Already have an account? Sign in
                            </MaterialLink>
                        </Grid>
                    </Grid>
                    {
                        alertVisible &&
                        <Alert className={classes.alert} severity="error">{alertMessage}</Alert>
                    }
                </form>
            </div>
        </Container>
    );
}

export default withRouter(Register);