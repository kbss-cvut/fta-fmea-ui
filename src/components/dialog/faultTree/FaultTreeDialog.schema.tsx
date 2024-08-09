import * as Yup from "yup";

export const schema = Yup.object().shape({
  faultTreeName: Yup.string().required(),
});
