export const formatFunctionOutput = (func, comp) => {
  let result = func.name + (comp != null ? " (" + comp.name + " )" : " (None)");
  return result.length > 50 ? result.substring(0, 50).concat("...") : result;
};

export const formatOutput = (name, limit) => {
  return name.length > limit ? name.substring(0, limit).concat("...") : name;
};
