import { useState } from "react";

export const useLocalContext = (data) => {
  const [ctx] = useState({});
  Object.keys(data).forEach((key) => {
    ctx[key] = data[key];
  });
  return ctx;
};
