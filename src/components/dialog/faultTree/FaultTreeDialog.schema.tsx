import * as Yup from "yup";

export const schema = Yup.object().shape({
  systemName: Yup.string().required(),
});
