import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditorCanvas from "./canvas/EditorCanvas";
import { findEventByIri } from "@utils/treeUtils";
import FaultEventContextMenu from "./menu/faultEvent/FaultEventContextMenu";
import { useLocalContext } from "@hooks/useLocalContext";
import * as faultEventService from "@services/faultEventService";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { useCurrentFaultTree } from "@hooks/useCurrentFaultTree";
import { useConfirmDialog } from "@hooks/useConfirmDialog";
import FaultEventDialog from "../../dialog/faultEvent/FaultEventDialog";
import { FaultEvent } from "@models/eventModel";
import { contextMenuDefaultAnchor, ElementContextMenuAnchor } from "@utils/contextMenu";
import FailureModesTableDialog from "@components/dialog/failureModesTable/FailureModesTableDialog";
import { ROUTES } from "@utils/constants";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { FTABoundary } from "@components/editor/faultTree/shapes/shapesDefinitions";
import * as joint from "jointjs";
import { Rectangle } from "@models/utils/Rectangle";
import { JOINTJS_NODE_MODEL } from "@components/editor/faultTree/shapes/constants";
import { FaultEventScenario } from "@models/faultEventScenario";
import { useAppBar } from "@contexts/AppBarContext";
import { asArray } from "@utils/utils";

const Editor = () => {
  const history = useNavigate();
  const [showSnackbar] = useSnackbar();
  const [requestConfirmation] = useConfirmDialog();
  const { setAppBarTitle } = useAppBar();

  const [faultTree, refreshTree] = useCurrentFaultTree();
  const [rootEvent, setRootEvent] = useState<FaultEvent>();
  const [faultEventScenarios, setFaultEventScenarios] = useState<FaultEventScenario[]>([]);
  const [showPath, setShowPath] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [highlightedElementView, setHighlightedElementView] = useState(null);

  const _localContext = useLocalContext({ rootEvent: rootEvent, highlightedElementView: highlightedElementView });

  const getRootEvent = (): FaultEvent => {
    // @ts-ignore
    return _localContext.rootEvent;
  };

  const getHighlightedElementView = () => {
    // @ts-ignore
    return _localContext.highlightedElementView;
  };

  useEffect(() => {
    if (faultTree) {
      setAppBarTitle(faultTree.name);
      setRootEvent(faultTree.manifestingEvent);

      if (faultTree.faultEventScenarios) {
        setFaultEventScenarios([getScenarioWithHighestProbability(asArray(faultTree.faultEventScenarios))]);
      }

      if (contextMenuSelectedEvent) {
        const sidebarEvent = findEventByIri(contextMenuSelectedEvent.iri, faultTree.manifestingEvent);
        setSidebarSelectedEvent(sidebarEvent);
      }

      if (sidebarSelectedEvent) {
        const sidebarEvent = findEventByIri(sidebarSelectedEvent.iri, faultTree.manifestingEvent);
        setSidebarSelectedEvent(sidebarEvent);
      }
    }
  }, [faultTree]);

  useEffect(() => {
    if (highlightedElementView) {
      highlightBorders(highlightedElementView);
    }
  }, [highlightedElementView]);

  useEffect(() => {
    refreshTree();
  }, [location.pathname]);

  const [contextMenuSelectedEvent, setContextMenuSelectedEvent] = useState<FaultEvent>(null);
  const [sidebarSelectedEvent, setSidebarSelectedEvent] = useState<FaultEvent>(null);

  const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor);
  const handleContextMenu = (elementView, evt) => {
    const elementIri = elementView.model.get(JOINTJS_NODE_MODEL.faultEventIri);

    const foundEvent = findEventByIri(elementIri, getRootEvent());
    setContextMenuSelectedEvent(foundEvent);
    setContextMenuAnchor({ mouseX: evt.pageX, mouseY: evt.pageY });
  };

  const handleElementPointerClick = (elementView) => {
    const elementIri = elementView.model.get(JOINTJS_NODE_MODEL.faultEventIri);
    const foundEvent = findEventByIri(elementIri, getRootEvent());

    setSidebarSelectedEvent(foundEvent);
    setHighlightedElementView(elementView);
  };

  const handleBlankPointerClick = () => {
    setSidebarSelectedEvent(null);
    hideHighlightedBorders();
  };

  const handleMoveEvent = (elementView, evt) => {
    const faultEventIri = elementView.model.get(JOINTJS_NODE_MODEL.faultEventIri);

    const movedEvent = findEventByIri(faultEventIri, getRootEvent());
    const rect: Rectangle = movedEvent.rectangle;
    const size = elementView.model.attributes.size;
    const position = elementView.model.attributes.position;
    if (rect.x != position.x || rect.y != position.y || rect.width != size.width || rect.height != size.height) {
      rect.x = position.x;
      rect.y = position.y;
      rect.width = size.width;
      rect.height = size.height;
      faultEventService.updateEventRectangle(faultEventIri, rect.iri, rect);
    }
  };

  const highlightBorders = (elementView) => {
    const tools = new joint.dia.ToolsView({
      tools: [FTABoundary.factory()],
    });
    elementView.addTools(tools);
  };
  const hideHighlightedBorders = () => {
    getHighlightedElementView()?.removeTools();
    setHighlightedElementView(null);
  };

  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const handleEventCreate = (newEvent: FaultEvent) => {
    setSidebarSelectedEvent(newEvent);
    refreshTree();
    showSnackbar("Event created", SnackbarType.SUCCESS);
  };

  const handleEventUpdate = (eventToUpdate: FaultEvent) => {
    eventToUpdate.supertypes = asArray(eventToUpdate.supertypes).map((t) => ({
      types: t.types,
      iri: t.iri,
      name: t.name,
    }))?.[0];

    faultEventService
      .update(eventToUpdate)
      .then((value) => {
        refreshTree();
        showSnackbar("Event updated", SnackbarType.SUCCESS);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const handleEventDelete = (eventToDelete: FaultEvent) => {
    const deleteEvent = () => {
      setSidebarSelectedEvent(null);
      hideHighlightedBorders();
      faultEventService
        .remove(eventToDelete.iri)
        .then((value) => {
          refreshTree();
          showSnackbar("Event deleted", SnackbarType.SUCCESS);
        })
        .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    requestConfirmation({
      title: "Delete Event",
      explanation: "Deleting the event will delete all events in its subtree. Are you sure?",
      onConfirm: deleteEvent,
    });
  };

  const handleCutSetAnalysis = () => {
    setShowPath(!showPath);
    setShowTable(!showTable);
    refreshTree();
  };

  const [failureModesTableOpen, setFailureModesTableOpen] = useState(false);
  const handleFailureModesTableCreated = (tableIri: string) => {
    console.log(`handleFailureModesTableCreated - ${tableIri}`);

    const tableFragment = extractFragment(tableIri);
    history(ROUTES.FMEA + tableFragment);
  };

  const handleOnContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const getScenarioWithHighestProbability = (list) => {
    if (list.length === 0) return null;
    const result = list.reduce((maxItem, currentItem) => {
      return currentItem.probability > maxItem.probability ? currentItem : maxItem;
    });
    return result;
  };

  const handleOnScenarioSelect = (scenario: FaultEventScenario) => {
    setFaultEventScenarios([scenario]);
    refreshTree();
  };

  return (
    <div onContextMenu={handleOnContextMenu}>
      {faultTree && (
        <EditorCanvas
          treeName={faultTree?.name}
          rootEvent={rootEvent}
          onEventUpdated={handleEventUpdate}
          sidebarSelectedEvent={sidebarSelectedEvent}
          onElementContextMenu={handleContextMenu}
          onElementPointerClick={handleElementPointerClick}
          onBlankPointerClick={handleBlankPointerClick}
          onCutSetAnalysis={handleCutSetAnalysis}
          onConvertToTable={() => setFailureModesTableOpen(true)}
          onNodeMove={handleMoveEvent}
          setHighlightedElement={setHighlightedElementView}
          refreshTree={refreshTree}
          faultEventScenarios={faultEventScenarios}
          possibleFaultEventScenarios={asArray(faultTree?.faultEventScenarios)}
          showPath={showPath}
          showTable={showTable}
          onScenarioSelect={(scenario: FaultEventScenario) => handleOnScenarioSelect(scenario)}
        />
      )}

      <FaultEventContextMenu
        eventType={contextMenuSelectedEvent?.eventType}
        isRootEvent={contextMenuSelectedEvent?.iri === faultTree?.manifestingEvent?.iri}
        anchorPosition={contextMenuAnchor}
        onNewEventClick={() => setEventDialogOpen(true)}
        onEventDelete={() => handleEventDelete(contextMenuSelectedEvent)}
        onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
      />

      <FaultEventDialog
        open={eventDialogOpen}
        eventIri={contextMenuSelectedEvent?.iri}
        treeUri={faultTree?.iri}
        onCreated={(newEvent) => handleEventCreate(newEvent)}
        onClose={() => setEventDialogOpen(false)}
      />

      <FailureModesTableDialog
        open={failureModesTableOpen}
        faultTreeIri={faultTree?.iri}
        onCreated={handleFailureModesTableCreated}
        onClose={() => setFailureModesTableOpen(false)}
      />
    </div>
  );
};

export default Editor;
