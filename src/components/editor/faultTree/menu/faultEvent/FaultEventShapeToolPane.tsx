import * as React from "react";
import { useEffect } from "react";
import { Divider, Typography } from "@mui/material";
import FaultEventCreation from "../../../../dialog/faultEvent/FaultEventCreation";
import { EventType, FaultEvent, GateType } from "@models/eventModel";
import FaultEventChildrenReorderList from "@components/editor/faultTree/menu/faultEvent/reorder/FaultEventChildrenReorderList";
import useStyles from "@components/editor/faultTree/menu/faultEvent/FaultEventShapeToolPane.styles";
import { ReusableFaultEventsProvider } from "@hooks/useReusableFaultEvents";
import { useCurrentFaultTree } from "@hooks/useCurrentFaultTree";
import { asArray } from "@utils/utils";
import { useTranslation } from "react-i18next";

interface Props {
  data?: FaultEvent;
  refreshTree: () => void;
  formMethods: any;
}

const FaultEventShapeToolPane = ({ data, refreshTree, formMethods }: Props) => {
  const { classes } = useStyles();
  const [faultTree] = useCurrentFaultTree();
  const { t } = useTranslation();

  const getFormValues = (data) => {
    if (data) {
      const safeSupertype = asArray(data.supertypes).map((t) => ({ name: t.name, iri: t.iri, types: t.types }))?.[0];
      return {
        eventType: data.eventType,
        name: data.name,
        description: data.description,
        probability: data.probability ? data.probability : 0.01,
        gateType: data.gateType ? data.gateType : null,
        sequenceProbability: data.sequenceProbability,
        existingEvent: safeSupertype,
      };
    } else {
      return {};
    }
  };

  useEffect(() => {
    formMethods.reset(getFormValues(data));
  }, [data]);

  const isDisabled =
    data &&
    ([EventType.INTERMEDIATE, EventType.BASIC, EventType.EXTERNAL].includes(data.eventType) || data.isReference);

  const editorPane = (isDisabled) => (
    <ReusableFaultEventsProvider treeUri={faultTree?.iri}>
      <FaultEventCreation
        useFormMethods={formMethods}
        isRootEvent={false}
        eventValue={data}
        isEditedEvent={true}
        isEditMode={true}
        disabled={isDisabled}
      />
    </ReusableFaultEventsProvider>
  );

  const editorPaneNoSelection = () => (
    <Typography className={classes.emptyTitle} variant="subtitle1" align="left">
      {t("faultEventMenu.notSelected")}
    </Typography>
  );

  return (
    <React.Fragment>
      {data ? editorPane(isDisabled) : editorPaneNoSelection()}
      {data?.gateType === GateType.PRIORITY_AND && (
        <React.Fragment>
          <Divider />
          <Typography variant="h5">Children Order:</Typography>
          <FaultEventChildrenReorderList eventChildren={data.children} handleReorder={refreshTree} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FaultEventShapeToolPane;
