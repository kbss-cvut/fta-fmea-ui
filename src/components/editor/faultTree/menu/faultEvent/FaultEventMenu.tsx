import { Button, Divider, Paper, Typography, Box } from "@mui/material";
import FaultEventShapeToolPane from "./FaultEventShapeToolPane";
import { EventType, FaultEvent } from "../../../../../models/eventModel";
import * as React from "react";
import FailureModeDialog from "../../../../dialog/failureMode/create/FailureModeDialog";
import { useState, useEffect } from "react";
import { EventFailureModeProvider } from "../../../../../hooks/useEventFailureMode";
import EventFailureModeList from "../failureMode/EventFailureModeList";
import { FailureMode } from "../../../../../models/failureModeModel";
import FailureModeShowDialog from "../../../../dialog/failureMode/show/FailureModeShowDialog";
import useStyles from "@components/editor/faultTree/menu/faultEvent/FaultEventMenu.styles";
import { asArray } from "@utils/treeUtils";
import { useTranslation } from "react-i18next";

interface Props {
  shapeToolData?: FaultEvent;
  onEventUpdated: (faultEvent: FaultEvent) => void;
  refreshTree: () => void;
}

const FaultEventMenu = ({ shapeToolData, onEventUpdated, refreshTree }: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);

  const [failureModeOverviewDialogOpen, setFailureModeOverviewDialogOpen] = useState(false);
  const [failureModeOverview, setFailureModeOverview] = useState<FailureMode | null>(null);

  const [criticality, setCriticality] = useState<number | undefined>(undefined);
  const [predictedFailureRate, setPredictedFailureRate] = useState<number | undefined>(undefined);
  const [ataSystem, setAtaSystem] = useState<string | undefined>(undefined);
  const [partNumber, setPartNumber] = useState<string | undefined>(undefined);
  const [stock, setStock] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);

  const handleFailureModeClicked = (failureMode: FailureMode) => {
    setFailureModeOverview(failureMode);
    setFailureModeOverviewDialogOpen(true);
  };

  useEffect(() => {
    if (shapeToolData?.supertypes?.criticality) {
      setCriticality(shapeToolData.supertypes.criticality);
    } else {
      setCriticality(undefined);
    }

    const types = asArray(shapeToolData?.supertypes?.supertypes)

    const filteredFailureRate = types.filter((type) => type.hasFailureRate);

    if (filteredFailureRate.length === 1 && filteredFailureRate[0].hasFailureRate?.prediction?.value) {
      setPredictedFailureRate(filteredFailureRate[0].hasFailureRate?.prediction?.value);
    } else {
      setPredictedFailureRate(undefined);
    }

    const superTypes = asArray(shapeToolData?.supertypes?.behavior?.item?.supertypes)

    const filteredAtaCode = superTypes.filter((sType) => sType?.ataCode);
    const filteredPartNumber = superTypes.filter((sType) => sType?.partNumber);

    if (filteredAtaCode.length === 1 && filteredAtaCode[0].ataCode && filteredAtaCode[0].name) {
      const ataSystemString = `${filteredAtaCode[0].ataCode} ${filteredAtaCode[0].name}`;
      setAtaSystem(ataSystemString);
    } else {
      setAtaSystem(undefined);
    }

    if (filteredPartNumber.length === 1 && filteredPartNumber[0].partNumber && filteredPartNumber[0].stock) {
      setPartNumber(filteredPartNumber[0].partNumber);
      setStock(filteredPartNumber[0].stock);
    } else {
      setPartNumber(undefined);
      setStock(undefined);
    }

    if (shapeToolData?.supertypes?.behavior?.item?.quantity) {
      setQuantity(shapeToolData?.supertypes?.behavior?.item?.quantity);
    } else {
      setQuantity(undefined);
    }
  }, [shapeToolData]);


  return (
    <Box paddingLeft={2} marginRight={2}>
      <Typography variant="h5" gutterBottom>
        Edit Event
      </Typography>
      <FaultEventShapeToolPane data={shapeToolData} onEventUpdated={onEventUpdated} refreshTree={refreshTree} />
      <Divider />

      {shapeToolData && (
        <EventFailureModeProvider eventIri={shapeToolData?.iri}>
          <Box style={{ marginTop: 16, marginBottom: 16 }}>
            {criticality && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.criticality")}:</span> {criticality}
              </Typography>
            )}

            {predictedFailureRate && (
              <Typography>
                {shapeToolData.eventType === EventType.INTERMEDIATE ? (
                  <span className={classes.label}>{t("faultEventMenu.fhaBasedFailureRate")}:</span>
                ) : (
                  <span className={classes.label}>{t("faultEventMenu.predictedFailureRate")}:</span>
                )}
                {` ${predictedFailureRate.toExponential(2)}`}
              </Typography>
            )}

            {ataSystem && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.ataSystem")}:</span> {ataSystem}
              </Typography>
            )}
            {partNumber && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.partNumber")}:</span> {partNumber}
              </Typography>
            )}
            {stock && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.stock")}:</span> {stock}
              </Typography>
            )}
            {quantity && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.quantity")}:</span> {quantity}
              </Typography>
            )}
          </Box>
          <Typography variant="h5" gutterBottom>
            Failure Mode
          </Typography>
          <EventFailureModeList onFailureModeClick={handleFailureModeClicked} />

          <Button color="primary" onClick={() => setFailureModeDialogOpen(true)}>
            Set Failure Mode
          </Button>

          <FailureModeDialog
            open={failureModeDialogOpen && Boolean(shapeToolData)}
            onClose={() => setFailureModeDialogOpen(false)}
            eventIri={shapeToolData?.iri}
          />

          <FailureModeShowDialog
            open={failureModeOverviewDialogOpen}
            failureMode={failureModeOverview}
            onClose={() => setFailureModeOverviewDialogOpen(false)}
          />
        </EventFailureModeProvider>
      )}
    </Box>
  );
};

export default FaultEventMenu;
