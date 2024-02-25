import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import * as failureModeService from "@services/failureModeService";
import * as componentService from "@services/componentService";
import * as systemService from "@services/systemService";
import { FailureMode } from "@models/failureModeModel";
import { filter } from "lodash";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { Component } from "@models/componentModel";

type failureModeContextType = [
  Map<string, FailureMode>,
  (
    failureMode: FailureMode,
    requiredFailureModes: FailureMode[],
    childBehaviors: FailureMode[],
  ) => Promise<FailureMode>,
  (failureMode: FailureMode) => Promise<FailureMode>,
  () => void,
  (functionIri: string, failureModeIri: string) => void,
  (functionIri: string, failureModeIri: string) => void,
  FailureMode[],
  (failureMode: FailureMode, dependantFailureMode: FailureMode, type: string) => void,
  (failureMode: FailureMode, dependantFailureMode: FailureMode, type: string) => void,
  (failureMode: FailureMode) => void,
  (failureMode: FailureMode) => void,
  (failureModeUri: string, type: string) => Promise<string[]>,
];

const failureModeContext = createContext<failureModeContextType>(null!);

export const useFailureMode = () => {
  const [
    allFailureModes,
    createFailureMode,
    editFailureMode,
    fetchAllFailureModes,
    addFailureModeToFunction,
    removeFailureModeToFunction,
    componentFailureModes,
    addDependantFailureMode,
    removeDependantFailureMode,
    removeFailureMode,
    addExistingFailureMode,
    getTransitiveClosure,
  ] = useContext(failureModeContext);
  return [
    allFailureModes,
    createFailureMode,
    editFailureMode,
    fetchAllFailureModes,
    addFailureModeToFunction,
    removeFailureModeToFunction,
    componentFailureModes,
    addDependantFailureMode,
    removeDependantFailureMode,
    removeFailureMode,
    addExistingFailureMode,
    getTransitiveClosure,
  ] as const;
};

type FailureModeProviderProps = {
  children: React.ReactNode;
  component: Component;
};

export const FailureModeProvider = ({ children, component }: FailureModeProviderProps) => {
  const [_allFailureModes, _setAllFailureModes] = useState<Map<string, FailureMode>>(new Map());
  const [_componentFailureModes, _setComponentFailureModes] = useState<FailureMode[]>([]);
  const [showSnackbar] = useSnackbar();

  const removeFailureMode = async (failureMode: FailureMode) => {
    componentService
      .removeFailureMode(component.iri, failureMode.iri)
      .then(() => {
        // ad-hoc fix - failureMode.component to null without fetching from server
        failureMode.component = undefined;
        let tmpFailureMode = _allFailureModes.get(failureMode.iri);
        if (tmpFailureMode) tmpFailureMode.component = undefined;

        showSnackbar("Failure mode removed", SnackbarType.SUCCESS);
        let tmpFailureModes = _componentFailureModes.filter((fm) => fm.iri !== failureMode.iri);
        _setComponentFailureModes([...tmpFailureModes]);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const fetchAllFailureModes = async () => {
    failureModeService
      .findAll()
      .then((failureModes) => {
        let map: Map<string, FailureMode> = new Map();
        failureModes.forEach((failureMode) => {
          map.set(failureMode.iri, failureMode);
        });
        _setAllFailureModes(map);
      })
      .catch(() => _setAllFailureModes(null));
  };

  const fetchComponentFailureModes = async () => {
    componentService.failureModes(component.iri).then((failureModes) => _setComponentFailureModes(failureModes));
  };

  const fetchSystemFailureModes = async (componentUri: string): Promise<FailureMode[]> => {
    return systemService.failureModes(componentUri).then((failureModes) => failureModes);
  };

  const addFailureModeToFunction = async (failureModeIri: string, functionIri: string) => {
    failureModeService
      .addFailureModeToFunction(extractFragment(failureModeIri), extractFragment(functionIri))
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const removeFailureModeToFunction = async (functionIri: string, failureModeIri: string) => {
    failureModeService
      .removeFailureModeToFunction(extractFragment(functionIri), extractFragment(failureModeIri))
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const getTransitiveClosure = async (functionUri: string, type: string) => {
    return failureModeService.getTransitiveClosure(functionUri, type).then((value) => value);
  };

  const addDependantFailureMode = async (failureMode: FailureMode, dependantFailureMode: FailureMode, type: string) => {
    failureModeService
      .addDependantFailureMode(extractFragment(failureMode.iri), extractFragment(dependantFailureMode.iri), type)
      .then(() => {
        if (type === "requiredBehavior") {
          failureMode.requiredBehaviors.push(dependantFailureMode);
        } else {
          failureMode.childBehaviors.push(dependantFailureMode);
        }
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const removeDependantFailureMode = async (
    failureMode: FailureMode,
    dependantFailureMode: FailureMode,
    type: string,
  ) => {
    failureModeService
      .removeDependantFailureMode(extractFragment(failureMode.iri), extractFragment(dependantFailureMode.iri), type)
      .then(() => {
        if (type === "requiredBehavior") {
          failureMode.requiredBehaviors = filter(
            failureMode.requiredBehaviors,
            (fm) => fm.iri !== dependantFailureMode.iri,
          );
        } else {
          failureMode.childBehaviors = filter(failureMode.childBehaviors, (fm) => fm.iri !== dependantFailureMode.iri);
        }
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const createFailureMode = async (
    failureMode: FailureMode,
    requiredFailureModes: FailureMode[],
    childBehaviors: FailureMode[],
  ): Promise<FailureMode> => {
    return componentService
      .addFailureMode(extractFragment(component.iri), failureMode)
      .then((fm) => {
        _setComponentFailureModes([..._componentFailureModes, fm]);
        _setAllFailureModes(new Map(_allFailureModes).set(fm.iri, fm));
        showSnackbar("Failure mode created", SnackbarType.SUCCESS);
        return fm;
      })
      .then((fm) => {
        requiredFailureModes.forEach((failMode) => {
          addDependantFailureMode(fm, failMode, "requiredBehavior");
          failureMode.requiredBehaviors.push(failMode);
        });

        childBehaviors.forEach((failMode) => {
          addDependantFailureMode(fm, failMode, "childBehavior");
          failureMode.childBehaviors.push(failMode);
        });

        return fm;
      });
  };

  const editFailureMode = async (failureMode: FailureMode): Promise<FailureMode> => {
    return failureModeService.editFailureMode(failureMode).then((editedFailureMode) => {
      _setAllFailureModes(
        new Map([..._allFailureModes].filter(([iri, _fm]) => iri !== failureMode.iri)).set(
          editedFailureMode.iri,
          editedFailureMode,
        ),
      );
      showSnackbar("FailureMode edited", SnackbarType.SUCCESS);
      return editedFailureMode;
    });
  };

  const addExistingFailureMode = async (failureMode: FailureMode) => {
    if (failureMode.component == null) {
      componentService
        .addFailureModeByURI(component.iri, failureMode.iri)
        .then(() => reassignVariables(failureMode))
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
      return;
    }

    let oldComponent = failureMode.component;
    componentService
      .removeFailureMode(oldComponent.iri, failureMode.iri)
      .then(() =>
        componentService.addFailureModeByURI(component.iri, failureMode.iri).then(() => reassignVariables(failureMode)),
      )
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const reassignVariables = (failureMode: FailureMode) => {
    failureMode.component = component;
    _setComponentFailureModes([..._componentFailureModes.filter((el) => el.iri !== failureMode.iri), failureMode]);
    _setAllFailureModes(
      new Map([..._allFailureModes].filter(([iri, _fm]) => iri !== failureMode.iri)).set(failureMode.iri, failureMode),
    );
    showSnackbar("FailureMode edited", SnackbarType.SUCCESS);
  };

  useEffect(() => {
    fetchAllFailureModes();
    fetchComponentFailureModes();
  }, [component]);

  return (
    <failureModeContext.Provider
      value={[
        _allFailureModes,
        createFailureMode,
        editFailureMode,
        fetchAllFailureModes,
        addFailureModeToFunction,
        removeFailureModeToFunction,
        _componentFailureModes,
        addDependantFailureMode,
        removeDependantFailureMode,
        removeFailureMode,
        addExistingFailureMode,
        getTransitiveClosure,
      ]}
    >
      {children}
    </failureModeContext.Provider>
  );
};
