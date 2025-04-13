import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { System } from "@models/systemModel";
import * as systemService from "@services/systemService";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { filter, findIndex } from "lodash";
import { useUserAuth } from "@hooks/useUserAuth";

type systemContextType = [
  System[],
  (systemToCreate: System) => void,
  (systemToUpdate: System, onSuccess: () => void, onFail: () => void) => void,
  (systemToDelete: System) => void,
  boolean,
  () => void,
];

export const systemContext = createContext<systemContextType>(null!);

export const useSystems = () => {
  const [systems, addSystem, updateSystem, removeSystem, loading, triggerFetch] = useContext(systemContext);
  return [systems, addSystem, updateSystem, removeSystem, loading, triggerFetch] as const;
};

export const SystemsProvider = ({ children }: ChildrenProps) => {
  const [_systems, _setSystems] = useState<System[]>([]);
  const [_loading, _setLoading] = useState<boolean>(false);
  const [showSnackbar] = useSnackbar();
  const loggedUser = useUserAuth();
  const [shouldFetchSystems, setShouldFetchSystems] = useState(true);

  useEffect(() => {
    const fetchSystems = async () => {
      _setLoading(true);
      systemService
        .findAll()
        .then((value) => {
          _setLoading(false);
          _setSystems(value);
          setShouldFetchSystems(false);
        })
        .catch((reason) => {
          _setLoading(false);
          showSnackbar(reason, SnackbarType.ERROR);
        });
    };

    if (loggedUser && shouldFetchSystems) fetchSystems();

    return () => axiosSource.cancel("SystemsProvider - unmounting");
  }, [loggedUser, shouldFetchSystems]);

  const addSystem = async (system: System) => {
    systemService
      .create(system)
      .then((value) => {
        showSnackbar("System created", SnackbarType.SUCCESS);
        setShouldFetchSystems(true);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const updateSystem = async (systemToUpdate: System, onSuccess: () => void, onFail: () => void) => {
    systemService
      .rename(systemToUpdate)
      .then((value) => {
        showSnackbar("System renamed", SnackbarType.SUCCESS);

        const index = findIndex(_systems, (el) => el.iri === systemToUpdate.iri);
        _systems.splice(index, 1, systemToUpdate);

        _setSystems(_systems);
        if (onSuccess) onSuccess();
      })
      .catch((reason) => {
        showSnackbar(reason, SnackbarType.ERROR);
        if (onFail) onFail();
      });
  };

  const removeSystem = async (systemToRemove: System) => {
    systemService
      .remove(systemToRemove.iri)
      .then((value) => {
        showSnackbar("System removed", SnackbarType.SUCCESS);
        const updatedTrees = filter(_systems, (el) => el.iri !== systemToRemove.iri);
        _setSystems(updatedTrees);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const triggerFetch = () => setShouldFetchSystems(true);

  return (
    <systemContext.Provider value={[_systems, addSystem, updateSystem, removeSystem, _loading, triggerFetch]}>
      {children}
    </systemContext.Provider>
  );
};
