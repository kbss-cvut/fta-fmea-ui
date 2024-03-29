import * as Yup from "yup";

export const schema = Yup.object().shape({
  faultTreeName: Yup.string().min(3, "Must be at least 3 character long").required("Fault Tree Name is mandatory"),
});
