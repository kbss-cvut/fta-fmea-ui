import * as React from "react";
import {UserContextProps} from "@models/userModel";
import {setLoggedUser} from "@utils/userSessionUtils";

const UserContext = React.createContext<Partial<UserContextProps>>({
    setUser: setLoggedUser
});

export default UserContext;