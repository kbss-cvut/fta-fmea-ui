import { AbstractModel } from "@models/abstractModel";
import { FaultTree } from "@models/faultTreeModel";
import { System } from "@models/systemModel";

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const simplifyReferencesOfReferences = <Type extends AbstractModel>(b: Type): Type => {
  return transformReferences(b, simplifyReferences);
};

export const simplifyReferences = <Type extends AbstractModel>(b: Type): Type => {
  return transformReferences(b, removeReferences);
};

const removeReferences = <Type extends AbstractModel>(o: Type): Type => {
  // @ts-ignore
  return { iri: o.iri, name: o.name, types: o.types } as Type;
};

const isAbstractModel = (e: any): e is AbstractModel => {
  return (
    e instanceof Object && !(e instanceof String) && !(e instanceof Array) && "iri" in e && "types" in e && "name" in e
  );
};

const transformReferences = <Type extends AbstractModel>(b: Type, transformer: <Type>(a: Type) => Type): Type => {
  let bCopy = { ...b } as Type;
  for (let key in b) {
    if (b[key]) {
      if (isAbstractModel(b[key])) {
        bCopy[key] = transformer(b[key]);
        //@ts-ignore
      } else if (b[key] instanceof Array && b[key].length > 0 && isAbstractModel(b[key][0])) {
        // @ts-ignore
        bCopy[key] = b[key].map(transformer);
      }
    }
  }
  return bCopy;
};

export const asArray = (objectOrArray) => {
  if (!objectOrArray) {
    return [];
  }
  if (Array.isArray(objectOrArray)) {
    return objectOrArray;
  }
  return [objectOrArray];
};

const getModifiedList = <T extends { name: string }>(items: T[], selected: string | null): T[] => {
  if (!items) return [];

  const selectedIndex = items.findIndex((item) => item.name === selected);

  if (selectedIndex !== -1) {
    const selectedItem = items[selectedIndex];
    return [selectedItem, ...items.slice(0, selectedIndex), ...items.slice(selectedIndex + 1)];
  } else {
    return items;
  }
};

export const getModifiedSystemsList = (systems: System[], selected: string | null) =>
  getModifiedList(systems, selected);

export const getModifiedFaultTreesList = (faultTrees: FaultTree[], selected: string | null) =>
  getModifiedList(faultTrees, selected);

export const formatDate = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleString("en-US", options);
};
