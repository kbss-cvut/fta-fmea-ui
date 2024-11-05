import { useState, useContext, createContext } from "react";
import { FaultTree } from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { filter, findIndex } from "lodash";
import { useUserAuth } from "@hooks/useUserAuth";

type faultTreeContextType = [
  FaultTree[],
  (faultTree: FaultTree) => void,
  (faultTreeToUpdate: FaultTree) => void,
  (faultTreeToDelete: FaultTree) => void,
  boolean,
  (filters?: { label?: string; snsLabel?: string; sort?: string }) => void,
];

export const faultTreesContext = createContext<faultTreeContextType>(null!);

export const useFaultTrees = () => {
  const [faultTrees, addFaultTree, updateTree, removeTree, loading, triggerFetch] = useContext(faultTreesContext);
  return [faultTrees, addFaultTree, updateTree, removeTree, loading, triggerFetch] as const;
};

export const FaultTreesProvider = ({ children }) => {
  const [_faultTrees, _setFaultTrees] = useState<FaultTree[]>([]);
  const [_loading, _setLoading] = useState(false);
  const [showSnackbar] = useSnackbar();
  const loggedUser = useUserAuth();

  const triggerFetch = (filters?: { label?: string; snsLabel?: string; sort?: string }) => {
    if (loggedUser) {
      const params: { [key: string]: string } = {};
      if (filters?.label) params.label = filters.label;
      if (filters?.snsLabel) params.snsLabel = filters.snsLabel;
      if (filters?.sort) params.sort = filters.sort;
      _setLoading(true);
      faultTreeService
        .findAllWithFilters(params)
        .then((value) => {
          _setLoading(false);
          _setFaultTrees(value);
        })
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    }
  };

  const addFaultTree = async (faultTree: FaultTree) => {
    faultTreeService
      .create(faultTree)
      .then((value) => {
        showSnackbar("Fault Tree created", SnackbarType.SUCCESS);
        faultTreeService.findAll().then((result) => _setFaultTrees(result));
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
      .then(() => {
        showSnackbar("Fault Tree removed", SnackbarType.SUCCESS);
        const updatedTrees = filter(_faultTrees, (el) => el.iri !== treeToRemove.iri);
        _setFaultTrees(updatedTrees);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  return (
    <faultTreesContext.Provider value={[_faultTrees, addFaultTree, updateTree, removeTree, _loading, triggerFetch]}>
      {children}
    </faultTreesContext.Provider>
  );
};
