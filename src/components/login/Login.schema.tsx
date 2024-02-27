import * as Yup from "yup";

export const schema = Yup.object().shape({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string().required("Password must not be blank"),
});
