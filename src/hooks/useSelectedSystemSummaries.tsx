import * as React from "react";
import { createContext, useContext, useState } from "react";
import { SELECTED_SYSTEM } from "@utils/constants";
import { ChildrenProps } from "@utils/hookUtils";
import { System } from "@models/systemModel";

type systemContextType = [System, (system: System) => void];

export const selectedSystemSummaryContext = createContext<systemContextType>(null!);

export const useSelectedSystemSummaries = () => {
  const [selectedSystemSummary, setSelectedSystemSummary] = useContext(selectedSystemSummaryContext);
  return [selectedSystemSummary, setSelectedSystemSummary] as const;
};

export const getSelectedSystemSummary = (): System => {
  const item = sessionStorage.getItem(SELECTED_SYSTEM);

  if (!item) return null;

  return JSON.parse(item);
};

export const SelectedSystemProvider = ({ children }: ChildrenProps) => {
  const [_systemSummary, _setSelectedSystemSummary] = useState<System>(getSelectedSystemSummary());

  const setSelectedSystemSummary = async (system: System) => {
    sessionStorage.removeItem(SELECTED_SYSTEM);
    if (system) sessionStorage.setItem(SELECTED_SYSTEM, JSON.stringify(system));
    _setSelectedSystemSummary(system);
  };

  return (
    <selectedSystemSummaryContext.Provider value={[_systemSummary, setSelectedSystemSummary]}>
      {children}
    </selectedSystemSummaryContext.Provider>
  );
};
