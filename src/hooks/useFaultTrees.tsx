import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { FaultTree } from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { filter, findIndex } from "lodash";
import { useUserAuth } from "@hooks/useUserAuth";

type faultTreeContextType = [
  FaultTree[],
  (faultTree: FaultTree) => void,
  (faultTreeToUpdate: FaultTree) => void,
  (faultTreeToDelete: FaultTree) => void,
  (filters?: { label?: string; snsLabel?: string }) => void,
];

export const faultTreesContext = createContext<faultTreeContextType>(null!);

export const useFaultTrees = () => {
  const [faultTrees, addFaultTree, updateTree, removeTree, triggerFetch] = useContext(faultTreesContext);
  return [faultTrees, addFaultTree, updateTree, removeTree, triggerFetch] as const;
};

export const FaultTreesProvider = ({ children }: ChildrenProps) => {
  const [_faultTrees, _setFaultTrees] = useState<FaultTree[]>([]);
  const [shouldFetchTrees, setShouldFetchTrees] = useState(true);
  const [showSnackbar] = useSnackbar();
  const loggedUser = useUserAuth();

  useEffect(() => {
    const fetchFaultTrees = async (filters?: { label?: string; snsLabel?: string }) => {
      faultTreeService
        .findAllWithFilters(filters || {})
        .then((value) => {
          _setFaultTrees(value);
          setShouldFetchTrees(false);
        })
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    if (loggedUser) fetchFaultTrees();
    return () => axiosSource.cancel("FaultTreesProvider - unmounting");
  }, [loggedUser, shouldFetchTrees]);

  const addFaultTree = async (faultTree: FaultTree) => {
    faultTreeService
      .create(faultTree)
      .then((value) => {
        showSnackbar("Fault Tree created", SnackbarType.SUCCESS);
        _setFaultTrees([..._faultTrees, value]);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const updateTree = async (treeToUpdate: FaultTree) => {
    faultTreeService
      .update(treeToUpdate)
      .then((value) => {
        showSnackbar("Fault Tree updated", SnackbarType.SUCCESS);

        const index = findIndex(_faultTrees, (el) => el.iri === treeToUpdate.iri);
        _faultTrees.splice(index, 1, treeToUpdate);

        _setFaultTrees([..._faultTrees]);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const removeTree = async (treeToRemove: FaultTree) => {
    faultTreeService
      .remove(treeToRemove.iri)
      .then((value) => {
        showSnackbar("Fault Tree removed", SnackbarType.SUCCESS);
        const updatedTrees = filter(_faultTrees, (el) => el.iri !== treeToRemove.iri);
        _setFaultTrees(updatedTrees);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const triggerFetch = (filters?: { label?: string; snsLabel?: string }) => {
    setShouldFetchTrees(true);
    if (filters) {
      faultTreeService
        .findAllWithFilters(filters)
        .then((value) => {
          _setFaultTrees(value);
          setShouldFetchTrees(false);
        })
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    }
  };

  return (
    <faultTreesContext.Provider value={[_faultTrees, addFaultTree, updateTree, removeTree, triggerFetch]}>
      {children}
    </faultTreesContext.Provider>
  );
};
