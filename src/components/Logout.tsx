import * as React from "react";
import {useContext, useEffect} from "react";
import UserContext from "@contexts/UserContext";
import {User} from "@models/userModel";

const Logout = () => {
    const {setUser} = useContext(UserContext);

    useEffect(() => {
        setUser({
            authenticated: false
        } as User)
    }, []);

    return <div>Logging out!</div>
};

export default Logout;