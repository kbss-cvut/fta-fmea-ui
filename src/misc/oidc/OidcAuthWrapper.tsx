import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { generateRedirectUri, getUserManager } from "@utils/OidcUtils";

const useThrow = () => {
  const [, setState] = useState();
  return useCallback(
    (error) =>
      setState(() => {
        throw error;
      }),
    [setState],
  );
};

/**
 * Context provider for user data and logout action trigger
 */
export const AuthContext = React.createContext(null);

const OidcAuthWrapper = ({ children, location = window.location }) => {
  const userManager = getUserManager();
  const throwError = useThrow();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userManager
      .getUser()
      .then((u) => {
        if (u && u.access_token && !u.expired) {
          // User authenticated
          // NOTE: the oidc-client-js library never returns null if the user is not authenticated
          // Checking for existence of BOTH access_token and expired field seems OK
          // Checking only for expired field is not enough
          setUser(u);
        } else {
          // User not authenticated -> trigger auth flow
          return userManager.signinRedirect({
            redirect_uri: generateRedirectUri(location.href),
          });
        }
      })
      .catch((error) => {
        throwError(error);
      });
  }, [location, throwError, setUser, userManager]);

  useEffect(() => {
    // Refreshing react state when new state is available in e.g. session storage
    const updateUserData = async () => {
      try {
        const user = await userManager.getUser();
        setUser(user);
      } catch (error) {
        throwError(error);
      }
    };

    userManager.events.addUserLoaded(updateUserData);

    // Unsubscribe on component unmount
    return () => userManager.events.removeUserLoaded(updateUserData);
  }, [throwError, setUser, userManager]);

  useEffect(() => {
    // Force log in if session cannot be renewed on background
    const handleSilentRenewError = async () => {
      try {
        await userManager.signinRedirect({
          redirect_uri: generateRedirectUri(location.href),
        });
      } catch (error) {
        throwError(error);
      }
    };

    userManager.events.addSilentRenewError(handleSilentRenewError);

    // Unsubscribe on component unmount
    return () => userManager.events.removeSilentRenewError(handleSilentRenewError);
  }, [location, throwError, setUser, userManager]);

  const logout = useCallback(() => {
    const handleLogout = async () => {
      const args = {};
      await userManager.signoutRedirect(args);
    };
    handleLogout();
  }, [userManager]);

  if (!user) {
    return null;
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
};

OidcAuthWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  location: PropTypes.object,
};

export default OidcAuthWrapper;
