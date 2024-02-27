import * as Yup from "yup";

export const schema = Yup.object().shape({
  systemName: Yup.string().min(1, "Must be at least 1 character long").required("System name is mandatory"),
});
