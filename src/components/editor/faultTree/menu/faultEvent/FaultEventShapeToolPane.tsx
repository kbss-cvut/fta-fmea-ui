import * as React from "react";
import { useEffect, useState } from "react";
import { cloneDeep, merge } from "lodash";
import { Button, Divider, Typography } from "@mui/material";
import FaultEventCreation from "../../../../dialog/faultEvent/FaultEventCreation";
import { useForm } from "react-hook-form";
import { schema as eventSchema } from "../../../../dialog/faultEvent/FaultEventCreation.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as faultEventService from "@services/faultEventService";
import { sequenceListToArray } from "@services/faultEventService";
import { deepOmit } from "@utils/lodashUtils";
import { FaultEvent, GateType } from "@models/eventModel";
import FaultEventChildrenReorderList from "@components/editor/faultTree/menu/faultEvent/reorder/FaultEventChildrenReorderList";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import useStyles from "@components/editor/faultTree/menu/faultEvent/FaultEventShapeToolPane.styles";
import { ReusableFaultEventsProvider } from "@hooks/useReusableFaultEvents";
import { useCurrentFaultTree } from "@hooks/useCurrentFaultTree";

interface Props {
  data?: FaultEvent;
  onEventUpdated: (faultEvent: FaultEvent) => void;
  refreshTree: () => void;
}

const FaultEventShapeToolPane = ({ data, onEventUpdated, refreshTree }: Props) => {
  const { classes } = useStyles();
  const [showSnackbar] = useSnackbar();
  const [faultTree] = useCurrentFaultTree();

  let editorPane;
  let updateEvent;
  let useFormMethods;
  let defaultValues;

  if (data) {
    defaultValues = {
      eventType: data.eventType,
      name: data.name,
      description: data.description,
      probability: data.probability ? data.probability : 0.01,
      gateType: data.gateType ? data.gateType : null,
      sequenceProbability: data.sequenceProbability,
    };

    useFormMethods = useForm({
      resolver: yupResolver(eventSchema),
    });

    updateEvent = async (values: any) => {
      let dataClone = cloneDeep(data);

      const updatedFaultEvent = deepOmit(faultEventService.eventFromHookFormValues(values), "@type");
      dataClone = merge(dataClone, updatedFaultEvent);
      dataClone.supertypes = updatedFaultEvent.supertypes;
      onEventUpdated(dataClone);
    };

    editorPane = (
      <ReusableFaultEventsProvider treeUri={faultTree?.iri}>
        <FaultEventCreation
          useFormMethods={useFormMethods}
          isRootEvent={false}
          eventValue={data}
          isEditedEvent={true}
        />
      </ReusableFaultEventsProvider>
    );
  } else {
    defaultValues = {};
    useFormMethods = useForm();
    editorPane = (
      <Typography className={classes.emptyTitle} variant="subtitle1" align="left">
        No Event selected
      </Typography>
    );
  }

  const eventSelected = Boolean(data);
  const { handleSubmit, reset, formState } = useFormMethods;
  const { isSubmitting, isDirty } = formState;

  useEffect(() => {
    reset(defaultValues);
    if (data) {
      const sequence = sequenceListToArray(data.childrenSequence);
      const sorted = faultEventService.eventChildrenSorted(data.children, sequence);
      setEventChildren(sorted);
    }
  }, [data]);

  const [eventChildren, setEventChildren] = useState<FaultEvent[] | null>(null);
  const handleChildrenReordered = (updatedSequence: FaultEvent[]) => {
    faultEventService
      .updateChildrenSequence(data?.iri, updatedSequence)
      .then((value) => refreshTree())
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  return (
    <React.Fragment>
      {editorPane}
      {isDirty && (
        <Button disabled={isSubmitting || !eventSelected} color="primary" onClick={handleSubmit(updateEvent)}>
          Save
        </Button>
      )}
      {data?.gateType === GateType.PRIORITY_AND && eventChildren && (
        <React.Fragment>
          <Divider />
          <Typography variant="h5">Children Order:</Typography>
          <FaultEventChildrenReorderList eventChildren={eventChildren} handleReorder={handleChildrenReordered} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FaultEventShapeToolPane;
