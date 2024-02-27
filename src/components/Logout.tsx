import * as React from "react";
import { useEffect } from "react";
import { User } from "@models/userModel";
import { useLoggedUser } from "@hooks/useLoggedUser";

const Logout = () => {
  const [_, setLoggedUser] = useLoggedUser();

  useEffect(() => {
    setLoggedUser({
      authenticated: false,
    } as User);
  }, []);

  return <div>Logging out!</div>;
};

export default Logout;
