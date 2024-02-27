import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import * as faultTreeService from "@services/faultTreeService";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { FaultEvent } from "@models/eventModel";

const faultTreePathsAggregateContext = createContext<[FaultEvent[]]>(null!);

export const useFaultTreePathsAggregate = () => {
  return useContext(faultTreePathsAggregateContext);
};

export const FaultTreePathsAggregateProvider = ({ children }: ChildrenProps) => {
  const [_paths, _setPaths] = useState<[FaultEvent[]] | null>(null);
  const [showSnackbar] = useSnackbar();

  useEffect(() => {
    const fetchPaths = async () => {
      faultTreeService
        .getTreePathsAggregate()
        .then((value) => _setPaths(value))
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };
    fetchPaths();

    return () => axiosSource.cancel("FaultTreePathsProvider - unmounting");
  }, []);

  return <faultTreePathsAggregateContext.Provider value={_paths}>{children}</faultTreePathsAggregateContext.Provider>;
};
