import {Button, Container, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import * as React from "react";
import useStyles from "./Register.styles";
import {FormEvent, useState} from "react";
import * as userService from "../../services/userService";
import {useHistory, withRouter} from "react-router-dom";

const Register = () => {
    const classes = useStyles();
    const history = useHistory();

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
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

    return (
        <Container className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h4">Register</Typography>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <Grid container spacing={8}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="text"
                                       onChange={e => setUsername(e.target.value)} fullWidth autoFocus required/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="password" label="Password" type="password"
                                       onChange={e => setPassword(e.target.value)} fullWidth required/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="passwordConfirm" label="Confirm Password" type="password"
                                       onChange={e => setPasswordConfirm(e.target.value)} fullWidth required/>
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{marginTop: '10px'}}>
                        <Button type="submit" variant="outlined" color="primary"
                                style={{textTransform: "none"}}>Register</Button>
                    </Grid>
                    {
                        alertVisible &&
                        <Alert className={classes.alert} severity="error">{alertMessage}</Alert>
                    }
                </form>
            </Paper>
        </Container>
    );
}

export default withRouter(Register);