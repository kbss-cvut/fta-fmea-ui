import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import * as failureModesTableService from "@services/failureModesTableService";
import { SnackbarType, useSnackbar } from "./useSnackbar";
import { filter, findIndex } from "lodash";
import { FailureModesTable, UpdateFailureModesTable } from "@models/failureModesTableModel";
import { useUserAuth } from "@hooks/useUserAuth";

type failureModesTableContextType = [
  FailureModesTable[],
  (tableToUpdate: UpdateFailureModesTable) => void,
  (tableToRemove: FailureModesTable) => void,
  (addTableAggregate: FailureModesTable) => void,
];

const failureModesTableContext = createContext<failureModesTableContextType>(null!);

export const useFailureModesTables = () => {
  const [failureModesTables, updateTable, removeTable, addTableAggregate] = useContext(failureModesTableContext);
  return [failureModesTables, updateTable, removeTable, addTableAggregate] as const;
};

export const FailureModesTablesProvider = ({ children }: ChildrenProps) => {
  const [_tables, _setTables] = useState<FailureModesTable[]>([]);
  const [showSnackbar] = useSnackbar();
  const loggedUser = useUserAuth();

  useEffect(() => {
    const fetchTables = async () => {
      failureModesTableService
        .findAll()
        .then((value) => _setTables(value))
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    if (loggedUser) fetchTables();
    return () => axiosSource.cancel("FailureModesTablesProvider - unmounting");
  }, []);

  const updateFailureMode = async (tableToUpdate: UpdateFailureModesTable) => {
    failureModesTableService
      .update(tableToUpdate)
      .then((value) => {
        showSnackbar("Failure Modes Table updated", SnackbarType.SUCCESS);

        const index = findIndex(_tables, (el) => el.iri === tableToUpdate.uri);
        _tables.splice(index, 1, value);

        _setTables(_tables);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const removeFailureMode = async (tableToRemove: FailureModesTable) => {
    failureModesTableService
      .remove(tableToRemove.iri)
      .then((value) => {
        showSnackbar("Failure Modes Table removed", SnackbarType.SUCCESS);
        const updateFailureModes = filter(_tables, (el) => el.iri !== tableToRemove.iri);
        _setTables(updateFailureModes);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const addTableAggregate = (table: FailureModesTable) => {
    showSnackbar("FMEA Table Aggregate Created", SnackbarType.SUCCESS);
    _setTables([..._tables, table]);
  };

  return (
    <failureModesTableContext.Provider value={[_tables, updateFailureMode, removeFailureMode, addTableAggregate]}>
      {children}
    </failureModesTableContext.Provider>
  );
};
