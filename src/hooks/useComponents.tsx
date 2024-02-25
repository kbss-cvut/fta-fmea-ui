import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { Component, CreateComponent } from "@models/componentModel";
import * as componentService from "@services/componentService";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";

type componentContextType = [Component[], (component: CreateComponent) => void];

export const componentsContext = createContext<componentContextType>(null!);

export const useComponents = () => {
  const [components, addComponent] = useContext(componentsContext);
  return [components, addComponent] as const;
};

export const ComponentsProvider = ({ children }: ChildrenProps) => {
  const [_components, _setComponents] = useState<Component[]>([]);
  const [showSnackbar] = useSnackbar();

  const addComponent = async (component: CreateComponent) => {
    componentService
      .create(component)
      .then((value) => {
        _setComponents([..._components, value]);
        showSnackbar("Component created", SnackbarType.SUCCESS);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  useEffect(() => {
    const fetchComponents = async () => {
      componentService
        .findAll()
        .then((value) => _setComponents(value))
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    fetchComponents();
    return () => {
      axiosSource.cancel("ComponentsProvider - unmounting");
    };
  }, []);

  return <componentsContext.Provider value={[_components, addComponent]}>{children}</componentsContext.Provider>;
};
