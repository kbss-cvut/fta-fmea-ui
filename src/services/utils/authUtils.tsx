import { getLoggedUser } from "@hooks/useInternalLoggedUser";

export const authHeaders = () => {
  return {
    Authorization: `Bearer ${getLoggedUser().token}`,
  };
};
