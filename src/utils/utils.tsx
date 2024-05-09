import { AbstractModel } from "@models/abstractModel";
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

export const getModifiedSystemsList = (systems: System[], selected: string | null) => {
  if (!systems) return [];
  if (!selected) return systems;

  const selectedSystemIndex = systems.findIndex((system) => system.name === selected);

  if (selectedSystemIndex !== -1) {
    const selectedSystem = systems[selectedSystemIndex];
    const updatedSystems = [
      selectedSystem,
      ...systems.slice(0, selectedSystemIndex),
      ...systems.slice(selectedSystemIndex + 1),
    ];
    return updatedSystems;
  } else {
    return systems;
  }
};
