import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { FaultTree } from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { filter, findIndex } from "lodash";
import { useLoggedUser } from "./useLoggedUser";

type faultTreeContextType = [
  FaultTree[],
  (faultTree: FaultTree) => void,
  (faultTreeToDelete: FaultTree) => void,
  (faultTreeToUpdate: FaultTree) => void,
];

export const faultTreesContext = createContext<faultTreeContextType>(null!);

export const useFaultTrees = () => {
  const [faultTrees, addFaultTree, updateTree, removeTree] = useContext(faultTreesContext);
  return [faultTrees, addFaultTree, updateTree, removeTree] as const;
};

export const FaultTreesProvider = ({ children }: ChildrenProps) => {
  const [_faultTrees, _setFaultTrees] = useState<FaultTree[]>([]);
  const [showSnackbar] = useSnackbar();
  const [loggedUser] = useLoggedUser();

  useEffect(() => {
    const fetchFaultTrees = async () => {
      faultTreeService
        .findAll()
        .then((value) => _setFaultTrees(value))
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    if (loggedUser.authenticated) fetchFaultTrees();

    return () => axiosSource.cancel("FaultTreesProvider - unmounting");
  }, []);

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

        _setFaultTrees(_faultTrees);
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

  return (
    <faultTreesContext.Provider value={[_faultTrees, addFaultTree, updateTree, removeTree]}>
      {children}
    </faultTreesContext.Provider>
  );
};
