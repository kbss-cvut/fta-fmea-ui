import { Button, Divider, Typography, Box, useTheme } from "@mui/material";
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
import { useTranslation } from "react-i18next";
import { asArray } from "@utils/utils";
import { ReusableFaultEventsProvider } from "@hooks/useReusableFaultEvents";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { Radio, RadioGroup, FormControlLabel, FormControl, TextField } from "@mui/material";

interface Props {
  shapeToolData?: FaultEvent;
  onEventUpdated: (faultEvent: FaultEvent) => void;
  refreshTree: () => void;
  rootIri?: string;
}

enum RadioButtonType {
  Predicted = "Predicted",
  Manual = "Manual",
  Operational = "Operational",
}

enum NodeTypeWithManualFailureRate {
  Sns = "Sns",
  External = "External",
}

const FaultEventMenu = ({ shapeToolData, onEventUpdated, refreshTree, rootIri }: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const theme = useTheme();
  const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);

  const [failureModeOverviewDialogOpen, setFailureModeOverviewDialogOpen] = useState(false);
  const [failureModeOverview, setFailureModeOverview] = useState<FailureMode | null>(null);

  const [criticality, setCriticality] = useState<number | undefined>(undefined);
  const [predictedFailureRate, setPredictedFailureRate] = useState<number | undefined>(undefined);
  const [ataSystem, setAtaSystem] = useState<string | undefined>(undefined);
  const [partNumber, setPartNumber] = useState<string | undefined>(undefined);
  const [stock, setStock] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [schematicDesignation, setSchematicDesignation] = useState<string | undefined>(undefined);
  const [selectedSystem] = useSelectedSystemSummaries();

  const [snsOperationalFailureRate, setSnsOperationalFailureRate] = useState<number | undefined>(undefined);
  const [snsPredictedFailureRate, setSnsPredictedFailureRate] = useState<number | undefined>(undefined);
  const [snsManuallyDefinedFailureRate, setSnsManuallyDefinedFailureRate] = useState<number | undefined>(undefined);
  const [externalManuallyDefinedFailureRate, setExternalManuallyDefinedFailureRate] = useState<number | undefined>(
    undefined,
  );
  const [selectedRadioButton, setSelectedRadioButton] = useState<string>(RadioButtonType.Predicted);

  const [snsOperationalIri, setSnsOperationalIri] = useState<string | undefined>(undefined);
  const [snsPredictedIri, setSnsPredictedIri] = useState<string | undefined>(undefined);

  const handleManuallyDefinedFailureRateChange = (event, type: NodeTypeWithManualFailureRate) => {
    const inputValue = event.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(inputValue)) {
      if (type === NodeTypeWithManualFailureRate.Sns) {
        setSnsManuallyDefinedFailureRate(inputValue);
      }
      if (type === NodeTypeWithManualFailureRate.External) {
        setExternalManuallyDefinedFailureRate(inputValue);
      }
    }
  };

  const handleSnsBasicSelectedFailureRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Add handler for update with error
    setSelectedRadioButton(event.target.value as RadioButtonType);
    if (event.target.value === RadioButtonType.Predicted) {
      // Updated when we switch to Pred. rate:
      onEventUpdated({
        ...shapeToolData,
        selectedEstimate: { iri: snsPredictedIri, value: snsPredictedFailureRate },
        probability: snsPredictedFailureRate,
      });
    }
    if (event.target.value === RadioButtonType.Operational) {
      // Updated when we switch to Oper. rate:
      onEventUpdated({
        ...shapeToolData,
        selectedEstimate: { iri: snsOperationalIri, value: snsOperationalFailureRate },
        probability: snsOperationalFailureRate,
      });
    }
  };

  const handleManualFailureRateUpdate = (eventType: EventType) => {
    const probability =
      eventType === EventType.EXTERNAL ? externalManuallyDefinedFailureRate : snsManuallyDefinedFailureRate;

    onEventUpdated({
      ...shapeToolData,
      probability,
      selectedEstimate: undefined,
    });
  };

  const handleFailureModeClicked = (failureMode: FailureMode) => {
    setFailureModeOverview(failureMode);
    setFailureModeOverviewDialogOpen(true);
  };

  useEffect(() => {
    // Clear values, after node was changed
    setSnsPredictedFailureRate(undefined);
    setSnsOperationalFailureRate(undefined);
    setSnsOperationalIri(undefined);
    setSnsPredictedIri(undefined);
    setExternalManuallyDefinedFailureRate(undefined);
    setSelectedRadioButton(RadioButtonType.Predicted);

    if (shapeToolData?.supertypes?.criticality) {
      setCriticality(shapeToolData.supertypes.criticality);
    } else {
      setCriticality(undefined);
    }

    const types = asArray(shapeToolData?.supertypes?.supertypes);

    const filteredFailureRate = types.filter((type) => type.hasFailureRate);

    if (filteredFailureRate.length === 1 && filteredFailureRate[0].hasFailureRate?.prediction?.value) {
      setPredictedFailureRate(filteredFailureRate[0].hasFailureRate?.prediction?.value);
    } else {
      setPredictedFailureRate(undefined);
    }

    const superTypes = asArray(shapeToolData?.supertypes?.behavior?.item?.supertypes);

    const filteredAtaCode = superTypes.filter((sType) => sType?.ataCode);
    const filteredPartNumber = superTypes.filter((sType) => sType?.partNumber);

    if (filteredAtaCode.length === 1 && filteredAtaCode[0].ataCode && filteredAtaCode[0].name) {
      const ataSystemString = `${filteredAtaCode[0].ataCode} ${filteredAtaCode[0].name}`;
      setAtaSystem(ataSystemString);
    } else {
      setAtaSystem(undefined);
    }

    if (filteredPartNumber.length === 1 && filteredPartNumber[0].partNumber) {
      setPartNumber(filteredPartNumber[0].partNumber);
    } else {
      setPartNumber(undefined);
    }

    if (shapeToolData?.supertypes?.behavior?.item?.quantity) {
      setQuantity(shapeToolData?.supertypes?.behavior?.item?.quantity);
    } else {
      setQuantity(undefined);
    }

    if (shapeToolData?.supertypes?.behavior?.item?.stock) {
      setStock(shapeToolData?.supertypes?.behavior?.item?.stock);
    } else {
      setStock(undefined);
    }

    if (shapeToolData?.supertypes?.behavior?.item?.schematicDesignation) {
      const schematicDesignations = asArray(shapeToolData?.supertypes?.behavior?.item?.schematicDesignation);
      setSchematicDesignation(schematicDesignations.join(", "));
    } else {
      setSchematicDesignation(undefined);
    }

    let supertypes: any = shapeToolData?.supertypes?.supertypes;

    if (shapeToolData?.selectedEstimate) {
      // SELECTED ESTIMATE => PREDICTED OR OPERATIONAL IS SELECTED
      const iriOfSelectedValue = shapeToolData.selectedEstimate.iri;
      const { predictionIri, operationalIri } = supertypes.reduce(
        (acc, item) => {
          if (item?.hasFailureRate?.prediction?.iri) acc.predictionIri = item.hasFailureRate.prediction.iri;
          if (item?.hasFailureRate?.estimate?.iri) acc.operationalIri = item.hasFailureRate.estimate.iri;
          return acc;
        },
        { predictionIri: "", operationalIri: "" },
      );

      if (iriOfSelectedValue === predictionIri) {
        setSelectedRadioButton(RadioButtonType.Predicted);
      } else if (iriOfSelectedValue === operationalIri) {
        setSelectedRadioButton(RadioButtonType.Operational);
      }
      setSnsManuallyDefinedFailureRate(shapeToolData?.probability);
    } else {
      // NO SELECTED ESTIMATE => MANUAL IS SELECTED
      setSelectedRadioButton(RadioButtonType.Manual);
      if (shapeToolData?.probability) {
        setSnsManuallyDefinedFailureRate(shapeToolData.probability);
        setExternalManuallyDefinedFailureRate(shapeToolData.probability);
      }
    }

    if (supertypes) {
      for (let i = 0; i < supertypes.length; i++) {
        const item = supertypes[i];
        if (item?.hasFailureRate?.estimate?.value) {
          setSnsOperationalFailureRate(item?.hasFailureRate?.estimate?.value);
          setSnsOperationalIri(item?.hasFailureRate?.estimate?.iri);
        }
        if (item?.hasFailureRate?.prediction?.value) {
          setSnsPredictedFailureRate(item?.hasFailureRate?.prediction?.value);
          setSnsPredictedIri(item?.hasFailureRate?.prediction?.iri);
        }
      }
    }
  }, [shapeToolData]);

  const basedFailureRate = shapeToolData?.supertypes?.supertypes?.hasFailureRate?.estimate?.value;
  const requiredFailureRate = shapeToolData?.supertypes?.hasFailureRate?.requirement?.upperBound;

  const FailureRateBox = ({ value, label, rate, selected }) => (
    <Box display="flex" flexDirection="row" alignItems="center">
      <FormControlLabel
        value={value}
        control={<Radio style={{ color: theme.main.black }} />}
        label={`${label}:`}
        className={selected ? classes.selected : classes.notSelected}
      />
      <Typography className={classes.notEditableValue}>{rate}</Typography>
    </Box>
  );

  return (
    <Box paddingLeft={2} marginRight={2}>
      {shapeToolData && shapeToolData.iri !== rootIri && (
        <ReusableFaultEventsProvider systemUri={selectedSystem?.iri}>
          <FaultEventShapeToolPane data={shapeToolData} onEventUpdated={onEventUpdated} refreshTree={refreshTree} />
        </ReusableFaultEventsProvider>
      )}
      {/* TODO: Finish for other nodes. Will be refactored. */}

      {/* ROOT NODE */}
      {shapeToolData && shapeToolData.iri === rootIri && (
        <>
          <Typography>
            <span className={classes.label}>Event name:</span>
            {shapeToolData.name}
          </Typography>
          {basedFailureRate && (
            <Box className={classes.labelRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.fhaBasedFailureRate")}:</span>
                {basedFailureRate.toExponential(2)}
              </Typography>
            </Box>
          )}
          {shapeToolData?.probabilityRequirement && (
            <Box className={classes.labelRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.requiredFailureRate")}:</span>
                {shapeToolData?.probabilityRequirement.toExponential(2)}
              </Typography>
            </Box>
          )}
          <Divider className={classes.divider} />
        </>
      )}

      {/* EXTERNAL NODE  */}
      {shapeToolData && shapeToolData.eventType === EventType.EXTERNAL && shapeToolData.isReference && (
        <>
          {shapeToolData?.probability && (
            <Box className={classes.labelRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.calculatedFailureRate")}:</span>
                {shapeToolData?.probability.toExponential(2)}
              </Typography>
            </Box>
          )}

          {basedFailureRate && (
            <Box className={classes.labelRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.fhaBasedFailureRate")}:</span>
                {shapeToolData?.supertypes?.supertypes?.hasFailureRate?.estimate?.value.toExponential(2)}
              </Typography>
            </Box>
          )}
          {requiredFailureRate && (
            <Box className={classes.labelRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.requiredFailureRate")}:</span>
                {shapeToolData?.supertypes?.hasFailureRate?.requirement?.upperBound.toExponential(2)}
              </Typography>
            </Box>
          )}
          <Divider className={classes.divider} />
        </>
      )}

      {/* INTERMEDIATE NODE */}
      {shapeToolData && shapeToolData.eventType === EventType.INTERMEDIATE && (
        <>
          {shapeToolData?.probability && (
            <Box className={classes.labelRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.calculatedFailureRate")}:</span>
                {shapeToolData?.probability.toExponential(2)}
              </Typography>
            </Box>
          )}
        </>
      )}
      {/* BASIC EVENT */}
      {shapeToolData && shapeToolData.eventType === EventType.BASIC && (
        <>
          <Box className={classes.labelRow}>
            <FormControl>
              <RadioGroup value={selectedRadioButton} onChange={handleSnsBasicSelectedFailureRateChange}>
                {snsPredictedFailureRate && (
                  <FailureRateBox
                    value={RadioButtonType.Predicted}
                    label={t("faultEventMenu.predictedFailureRate")}
                    rate={snsPredictedFailureRate}
                    selected={selectedRadioButton === RadioButtonType.Predicted}
                  />
                )}
                {snsOperationalFailureRate && (
                  <FailureRateBox
                    value={RadioButtonType.Operational}
                    label={t("faultEventMenu.operationalFailureRate")}
                    rate={snsOperationalFailureRate}
                    selected={selectedRadioButton === RadioButtonType.Operational}
                  />
                )}
                <Box display={"flex"} flexDirection={"row"} alignItems="center">
                  <FormControlLabel
                    value={RadioButtonType.Manual}
                    control={<Radio style={{ color: theme.main.black }} />}
                    label={`${t("faultEventMenu.manuallyDefinedFailureRate")}:`}
                    className={selectedRadioButton === RadioButtonType.Manual ? classes.selected : classes.notSelected}
                  />
                  <TextField
                    className={classes.numberInput}
                    InputLabelProps={{ shrink: false }}
                    variant="outlined"
                    value={snsManuallyDefinedFailureRate || ""}
                    onChange={(event) =>
                      handleManuallyDefinedFailureRateChange(event, NodeTypeWithManualFailureRate.Sns)
                    }
                    inputProps={{ inputMode: "decimal" }}
                    disabled={selectedRadioButton !== RadioButtonType.Manual}
                    onBlur={() => handleManualFailureRateUpdate(EventType.BASIC)}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        </>
      )}

      {/* EXTERNAL NODE */}
      {shapeToolData && shapeToolData.eventType === EventType.EXTERNAL && !shapeToolData.isReference && (
        <Box className={classes.labelRow}>
          <Typography className={classes.label}>{`${t("faultEventMenu.manuallyDefinedFailureRate")}:`}</Typography>
          <TextField
            className={classes.numberInput}
            InputLabelProps={{ shrink: false }}
            variant="outlined"
            value={externalManuallyDefinedFailureRate || ""}
            onChange={(event) => handleManuallyDefinedFailureRateChange(event, NodeTypeWithManualFailureRate.External)}
            inputProps={{ inputMode: "decimal" }}
            onBlur={() => handleManualFailureRateUpdate(EventType.EXTERNAL)}
          />
          <Divider className={classes.divider} />
        </Box>
      )}

      {shapeToolData && (
        <EventFailureModeProvider eventIri={shapeToolData?.iri}>
          <Box>
            {criticality && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.criticality")}:</span>
                <span className={classes.notEditableValue}>{criticality}</span>
              </Typography>
            )}
            {ataSystem && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.ataSystem")}:</span>
                <span className={classes.notEditableValue}>{ataSystem}</span>
              </Typography>
            )}
            {partNumber && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.partNumber")}:</span>
                <span className={classes.notEditableValue}>{partNumber}</span>
              </Typography>
            )}
            {stock && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.stock")}:</span>
                <span className={classes.notEditableValue}>{stock}</span>
              </Typography>
            )}
            {quantity && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.quantity")}:</span>
                <span className={classes.notEditableValue}>{quantity}</span>
              </Typography>
            )}
            {schematicDesignation && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.schematicDesignation")}:</span>
                <span className={classes.notEditableValue}>{schematicDesignation}</span>
              </Typography>
            )}
          </Box>

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
