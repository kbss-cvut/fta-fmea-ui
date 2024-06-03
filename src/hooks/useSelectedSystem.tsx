import * as React from "react";
import { createContext, useContext, useState } from "react";
import {SELECTED_SYSTEM} from "@utils/constants";
import { ChildrenProps } from "@utils/hookUtils";
import {System} from "../models/systemModel";

type systemContextType = [System, (system: System) => void];

export const selectedSystemContext = createContext<systemContextType>(null!);

export const useSelectedSystem = () => {
  const [selectedSystem, setSelectedSystem] = useContext(selectedSystemContext);
  return [selectedSystem, setSelectedSystem] as const;
};

export const getSelectedSystem = (): System => {
  const item = sessionStorage.getItem(SELECTED_SYSTEM);

  if (!item)
    return null;

  return JSON.parse(item);
};

export const SelectedSystemProvider = ({ children }: ChildrenProps) => {
  const [_system, _setSelectedSystem] = useState<System>(getSelectedSystem());

  const setSelectedSystem = async (system: System) => {
    sessionStorage.removeItem(SELECTED_SYSTEM);
    if(system)
      sessionStorage.setItem(SELECTED_SYSTEM, JSON.stringify(system));
    _setSelectedSystem(system);
  };

  return <selectedSystemContext.Provider value={[_system, setSelectedSystem]}>{children}</selectedSystemContext.Provider>;
};
