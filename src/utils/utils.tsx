import { AbstractModel } from "@models/abstractModel";
import { FaultTree } from "@models/faultTreeModel";
import { System } from "@models/systemModel";
import { FaultEvent } from "@models/eventModel";

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

  const selectedIndex = items.findIndex((item) => item.iri === selected);

  if (selectedIndex !== -1) {
    const selectedItem = items[selectedIndex];
    return [selectedItem, ...items.slice(0, selectedIndex), ...items.slice(selectedIndex + 1)];
  } else {
    return items;
  }
};

export const getModifiedSystemsList = (systems: System[], selected: string | null) =>
  getModifiedList(systems, selected);

export const getModifiedFaultTreesList = (faultTrees: FaultTree[], selected: string | null) => {
  if (!faultTrees || !selected) return faultTrees;
  return faultTrees.filter((f) => f?.system?.iri == selected);
};

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

/**
 * Updates the eventType of events in an array if a specific substring is found in its IRI.
 *
 * @param {Array<FaultEvent>} events - The array of event objects to be processed.
 * @param {string} substring - The substring to search for within the specified key's value.
 * @param {string} newValue - The new value to set for eventType if the substring is found.
 * @returns {Array<FaultEvent>} A new array of event objects with updated eventType values where applicable.
 *
 */
export const updateEventsType = (events: FaultEvent[], substring: string, newValue: string) => {
  return events.map((event) => ({
    ...event,
    eventType: event.iri.includes(substring) ? newValue : event.eventType,
  }));
};
