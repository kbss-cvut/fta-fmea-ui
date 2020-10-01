import * as React from "react";

const Login = () => {
    return (
        <form method="post">
            <h2>Log in</h2>
            <input type="text" className="form-control" placeholder="Username"/>
            <input type="password" placeholder="Password"/>
            <button type="submit">Log in</button>
        </form>
    );
}

export default Login;