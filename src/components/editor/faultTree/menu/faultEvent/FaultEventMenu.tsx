import {
  Button,
  Divider,
  Typography,
  Box,
  useTheme,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from "@mui/material";
import FaultEventShapeToolPane from "./FaultEventShapeToolPane";
import { EventType, FaultEvent } from "@models/eventModel";
import * as React from "react";
import FailureModeDialog from "../../../../dialog/failureMode/create/FailureModeDialog";
import { useState, useEffect } from "react";
import { EventFailureModeProvider } from "@hooks/useEventFailureMode";
import EventFailureModeList from "../failureMode/EventFailureModeList";
import { FailureMode } from "@models/failureModeModel";
import FailureModeShowDialog from "../../../../dialog/failureMode/show/FailureModeShowDialog";
import useStyles from "@components/editor/faultTree/menu/faultEvent/FaultEventMenu.styles";
import { useTranslation } from "react-i18next";
import { asArray } from "@utils/utils";
import { ReusableFaultEventsProvider } from "@hooks/useReusableFaultEvents";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { useForm } from "react-hook-form";
import UnsavedChangesDialog from "./UnsavedChangesDialog";
import { useAppBar } from "@contexts/AppBarContext";

interface Props {
  selectedShapeToolData?: FaultEvent;
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

const getFailureRateIris = (supertypes) => {
  const value = asArray(supertypes);
  return value.reduce(
    (acc, item) => {
      if (item?.hasFailureRate?.prediction?.iri) acc.predictionIri = item.hasFailureRate.prediction.iri;
      if (item?.hasFailureRate?.estimate?.iri) acc.operationalIri = item.hasFailureRate.estimate.iri;
      return acc;
    },
    { predictionIri: "", operationalIri: "" },
  );
};

const FaultEventMenu = ({ selectedShapeToolData, onEventUpdated, refreshTree, rootIri }: Props) => {
  const { t } = useTranslation();
  const formMethods = useForm();
  const { formState, getValues } = formMethods;
  const { isDirty } = formState;
  const { classes } = useStyles();
  const { isModified, setIsModified, showUnsavedChangesDialog, setShowUnsavedChangesDialog } = useAppBar();
  const theme = useTheme();
  const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);
  const [resetMenu, setResetMenu] = useState<boolean>(false);
  const [shapeToolData, setShapeToolData] = useState<FaultEvent | undefined>(undefined);

  useEffect(() => {
    if (isModified) {
      setShowUnsavedChangesDialog(true);
    } else {
      setShapeToolData(selectedShapeToolData);
    }
  }, [selectedShapeToolData]);

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
  const [basicManuallyDefinedFailureRate, setBasicManuallyDefinedFailureRate] = useState<number | undefined>(undefined);
  const [externalManuallyDefinedFailureRate, setExternalManuallyDefinedFailureRate] = useState<number | undefined>(
    undefined,
  );
  const [selectedRadioButton, setSelectedRadioButton] = useState<string>(RadioButtonType.Predicted);
  const [preselectedRadioButton, setPreselectedSelectedRadioButton] = useState<string | undefined>();

  const [snsOperationalIri, setSnsOperationalIri] = useState<string | undefined>(undefined);
  const [snsPredictedIri, setSnsPredictedIri] = useState<string | undefined>(undefined);

  const handleOnSave = async () => {
    setIsModified(false);
    const values = getValues();
    const { description, gateType } = values;
    const updateEvent = async (data) => await onEventUpdated({ ...shapeToolData, ...data, gateType, description });

    const eventTypeData = {
      [RadioButtonType.Predicted]: { iri: snsPredictedIri, value: snsPredictedFailureRate },
      [RadioButtonType.Operational]: { iri: snsOperationalIri, value: snsOperationalFailureRate },
    };

    const manualFailureRates = {
      [EventType.BASIC]: basicManuallyDefinedFailureRate,
      default: externalManuallyDefinedFailureRate,
    };

    if (selectedRadioButton === RadioButtonType.Manual) {
      await updateEvent({
        probability: manualFailureRates[shapeToolData.eventType] || manualFailureRates.default,
        selectedEstimate: undefined,
      });
    } else {
      const { iri, value } = eventTypeData[selectedRadioButton];
      await updateEvent({
        selectedEstimate: { iri, value },
        probability: value,
      });
    }
  };

  const handleOnDiscard = () => {
    formMethods.reset();
    setResetMenu(!resetMenu);
    setIsModified(false);
  };

  const handleManuallyDefinedFailureRateChange = (event, type: NodeTypeWithManualFailureRate) => {
    const inputValue = event.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(inputValue)) {
      if (type === NodeTypeWithManualFailureRate.Sns) {
        setBasicManuallyDefinedFailureRate(inputValue);
      }
      if (type === NodeTypeWithManualFailureRate.External) {
        setExternalManuallyDefinedFailureRate(inputValue);
      }
      setIsModified(true);
    }
  };

  const handleSnsBasicSelectedFailureRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === preselectedRadioButton) {
      setSelectedRadioButton(event.target.value as RadioButtonType);
      setIsModified(false);
    } else {
      setSelectedRadioButton(event.target.value as RadioButtonType);
      setIsModified(true);
    }
  };

  const handleFailureModeClicked = (failureMode: FailureMode) => {
    setFailureModeOverview(failureMode);
    setFailureModeOverviewDialogOpen(true);
  };

  const handleUnsavedChanges = (action) => {
    action();
    setShowUnsavedChangesDialog(false);
    setShapeToolData(selectedShapeToolData);
  };

  useEffect(() => {
    const setInitialStates = () => {
      setSnsPredictedFailureRate(undefined);
      setSnsOperationalFailureRate(undefined);
      setSnsOperationalIri(undefined);
      setSnsPredictedIri(undefined);
      setExternalManuallyDefinedFailureRate(undefined);
      setBasicManuallyDefinedFailureRate(undefined);
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

      if (shapeToolData?.selectedEstimate) {
        // SELECTED ESTIMATE => PREDICTED OR OPERATIONAL IS SELECTED
        const iriOfSelectedValue = shapeToolData.selectedEstimate.iri;
        const { predictionIri, operationalIri } = getFailureRateIris(types);

        if (iriOfSelectedValue === predictionIri) {
          setSelectedRadioButton(RadioButtonType.Predicted);
          setPreselectedSelectedRadioButton(RadioButtonType.Predicted);
        } else if (iriOfSelectedValue === operationalIri) {
          setSelectedRadioButton(RadioButtonType.Operational);
          setPreselectedSelectedRadioButton(RadioButtonType.Operational);
        }
        setBasicManuallyDefinedFailureRate(undefined);
        setExternalManuallyDefinedFailureRate(undefined);
      } else {
        // NO SELECTED ESTIMATE => MANUAL IS SELECTED
        setSelectedRadioButton(RadioButtonType.Manual);
        setPreselectedSelectedRadioButton(RadioButtonType.Manual);
        if (shapeToolData?.probability) {
          setBasicManuallyDefinedFailureRate(shapeToolData.probability);
          setExternalManuallyDefinedFailureRate(shapeToolData.probability);
        }
      }

      if (types) {
        for (let i = 0; i < types.length; i++) {
          const item = types[i];
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
    };

    setInitialStates();
  }, [shapeToolData, resetMenu]);

  useEffect(() => {
    setIsModified(isDirty);
  }, [isDirty]);

  const basedFailureRate = shapeToolData?.supertypes?.hasFailureRate?.estimate?.value;
  const requiredFailureRate = shapeToolData?.supertypes?.hasFailureRate?.requirement?.upperBound;
  const { predictionIri, operationalIri } = getFailureRateIris(shapeToolData?.supertypes?.supertypes);

  const FailureRateBox = ({ value, label, rate, selected, outdated }) => (
    <Box display="flex" flexDirection="row" alignItems="center">
      <FormControlLabel
        value={value}
        control={<Radio style={{ color: theme.main.black }} />}
        label={`${label}:`}
        className={selected ? classes.selected : classes.notSelected}
      />
      <Tooltip title={rate}>
        <Typography className={outdated ? classes.outdated : classes.notEditableValue}>
          {rate.toExponential(2)}
        </Typography>
      </Tooltip>
    </Box>
  );

  const renderFailureRateBox = (rateType, rateValue, iri, selectedRadioButton, labelKey) => {
    const rate =
      shapeToolData.probability !== rateValue && shapeToolData?.selectedEstimate?.iri === iri
        ? shapeToolData.probability
        : rateValue;
    const selected = selectedRadioButton === rateType;
    const outdated = selected && shapeToolData.probability !== rateValue;

    return <FailureRateBox value={rateType} label={t(labelKey)} rate={rate} selected={selected} outdated={outdated} />;
  };

  return (
    <Box paddingLeft={2} marginRight={2}>
      {shapeToolData && shapeToolData.iri !== rootIri && (
        <ReusableFaultEventsProvider systemUri={selectedSystem?.iri}>
          <FaultEventShapeToolPane data={shapeToolData} refreshTree={refreshTree} formMethods={formMethods} />
        </ReusableFaultEventsProvider>
      )}
      {/* TODO: Finish for other nodes. Will be refactored. */}

      {/* ROOT NODE */}
      {shapeToolData && shapeToolData.iri === rootIri && (
        <>
          <Typography className={classes.eventPropertyRow}>
            <span className={classes.label}>{`${t("faultEventMenu.eventName")}: `}</span>
            {shapeToolData.name}
          </Typography>
          {basedFailureRate && (
            <Box className={classes.eventPropertyRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.fhaBasedFailureRate")}:</span>
                {basedFailureRate.toExponential(2)}
              </Typography>
            </Box>
          )}
          {shapeToolData?.probabilityRequirement && (
            <Box className={classes.eventPropertyRow}>
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
            <Box className={classes.eventPropertyRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.calculatedFailureRate")}:</span>
                {shapeToolData?.probability.toExponential(2)}
              </Typography>
            </Box>
          )}

          {basedFailureRate && (
            <Box className={classes.eventPropertyRow}>
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.fhaBasedFailureRate")}:</span>
                {shapeToolData?.supertypes?.supertypes?.hasFailureRate?.estimate?.value.toExponential(2)}
              </Typography>
            </Box>
          )}
          {requiredFailureRate && (
            <Box className={classes.eventPropertyRow}>
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
            <Box className={classes.eventPropertyRow}>
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
          <Box className={classes.eventPropertyRow}>
            <FormControl>
              <RadioGroup value={selectedRadioButton} onChange={handleSnsBasicSelectedFailureRateChange}>
                {snsPredictedFailureRate &&
                  renderFailureRateBox(
                    RadioButtonType.Predicted,
                    snsPredictedFailureRate,
                    predictionIri,
                    selectedRadioButton,
                    "faultEventMenu.predictedFailureRate",
                  )}
                {snsOperationalFailureRate &&
                  renderFailureRateBox(
                    RadioButtonType.Operational,
                    snsOperationalFailureRate,
                    operationalIri,
                    selectedRadioButton,
                    "faultEventMenu.operationalFailureRate",
                  )}
                <Box display={"flex"} flexDirection={"row"} alignItems="center">
                  <FormControlLabel
                    value={RadioButtonType.Manual}
                    control={snsOperationalFailureRate || snsPredictedFailureRate ? <Radio /> : <></>}
                    label={`${t("faultEventMenu.manuallyDefinedFailureRate")}:`}
                    className={selectedRadioButton === RadioButtonType.Manual ? classes.selected : classes.notSelected}
                    // Compensate the removal of the radio button, 16px is the MUI <Box /> default left padding
                    sx={snsOperationalFailureRate || snsPredictedFailureRate ? {} : { pl: "16px" }}
                  />
                  <TextField
                    className={classes.numberInput}
                    InputLabelProps={{ shrink: false }}
                    variant="outlined"
                    value={basicManuallyDefinedFailureRate || ""}
                    onChange={(event) =>
                      handleManuallyDefinedFailureRateChange(event, NodeTypeWithManualFailureRate.Sns)
                    }
                    inputProps={{ inputMode: "decimal" }}
                    disabled={selectedRadioButton !== RadioButtonType.Manual}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        </>
      )}

      {/* EXTERNAL NODE */}
      {shapeToolData && shapeToolData.eventType === EventType.EXTERNAL && !shapeToolData.isReference && (
        <Box className={classes.eventPropertyRow}>
          <Typography className={classes.label}>{`${t("faultEventMenu.manuallyDefinedFailureRate")}:`}</Typography>
          <TextField
            className={classes.numberInput}
            InputLabelProps={{ shrink: false }}
            variant="outlined"
            value={externalManuallyDefinedFailureRate || ""}
            onChange={(event) => handleManuallyDefinedFailureRateChange(event, NodeTypeWithManualFailureRate.External)}
            inputProps={{ inputMode: "decimal" }}
          />
          <Divider className={classes.divider} />
        </Box>
      )}

      {isModified && (
        <Box display="flex" flexDirection="row">
          <Button onClick={handleOnSave}>{t("common.save")}</Button>
          <Button onClick={handleOnDiscard}>{t("common.discard")}</Button>
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
      <UnsavedChangesDialog
        isModalOpen={showUnsavedChangesDialog}
        onDiscard={() => handleUnsavedChanges(handleOnDiscard)}
        onSave={() => handleUnsavedChanges(handleOnSave)}
      />
    </Box>
  );
};

export default FaultEventMenu;
