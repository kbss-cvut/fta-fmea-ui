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
import { EventType, FaultEvent, getFailureRates } from "@models/eventModel";
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
import { syncProblemIcon, warnIcon } from "@components/Icons";
import HintText from "@components/hintText/HintText";
import { statusMessages } from "@components/fta/FTAStatus";
import { FaultTreeStatus } from "@models/faultTreeModel";

interface Props {
  selectedShapeToolData?: FaultEvent;
  faultTreeStatus?: FaultTreeStatus;
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

const FaultEventMenu = ({
  selectedShapeToolData,
  faultTreeStatus = null,
  onEventUpdated,
  refreshTree,
  rootIri,
}: Props) => {
  const { t } = useTranslation();
  const formMethods = useForm();
  const { formState, getValues } = formMethods;
  const { isDirty } = formState;
  const { classes } = useStyles();
  const { isModified, setIsModified, showUnsavedChangesDialog, setShowUnsavedChangesDialog } = useAppBar();
  const theme = useTheme();
  const [failureModeDialogOpen, setFailureModeDialogOpen] = useState(false);
  const [resetMenu, setResetMenu] = useState<boolean>(false);
  const [shapeToolData, setShapeToolData] = useState<FaultEvent | undefined>();

  const getRequiredFailureRate = () => shapeToolData.supertypes?.hasFailureRate?.requirement?.upperBound;

  useEffect(() => {
    if (isModified) {
      setShowUnsavedChangesDialog(true);
    } else {
      setShapeToolData(selectedShapeToolData);
    }
  }, [selectedShapeToolData]);

  const [failureModeOverviewDialogOpen, setFailureModeOverviewDialogOpen] = useState(false);
  const [failureModeOverview, setFailureModeOverview] = useState<FailureMode | null>(null);

  const [criticality, setCriticality] = useState<string | undefined>(undefined);
  const [ataCode, setAtaCode] = useState<string | undefined>("");
  const [ataNames, setAtaNames] = useState<string[] | undefined>(undefined);
  const [partNumber, setPartNumber] = useState<string | undefined>("");
  const [stock, setStock] = useState<string | undefined>("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [schematicDesignation, setSchematicDesignation] = useState<string | undefined>("");
  const [selectedSystem] = useSelectedSystemSummaries();

  const [snsOperationalFailureRate, setSnsOperationalFailureRate] = useState<number | undefined>(0);
  const [snsPredictedFailureRate, setSnsPredictedFailureRate] = useState<number | undefined>(0);
  const [basicManuallyDefinedFailureRate, setBasicManuallyDefinedFailureRate] = useState<number | undefined>(0);
  const [externalManuallyDefinedFailureRate, setExternalManuallyDefinedFailureRate] = useState<number | undefined>(0);
  const [selectedRadioButton, setSelectedRadioButton] = useState<string>(RadioButtonType.Predicted);
  const [preselectedRadioButton, setPreselectedSelectedRadioButton] = useState<string | undefined>("");

  const [snsOperationalIri, setSnsOperationalIri] = useState<string | undefined>("");
  const [snsPredictedIri, setSnsPredictedIri] = useState<string | undefined>("");

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
      [EventType.EXTERNAL]: externalManuallyDefinedFailureRate,
      default: externalManuallyDefinedFailureRate,
    };

    if (selectedRadioButton === RadioButtonType.Manual) {
      await updateEvent({
        probability: manualFailureRates[shapeToolData.eventType],
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
      const inputNumber = inputValue === "" ? undefined : inputValue;
      if (type === NodeTypeWithManualFailureRate.Sns) {
        setBasicManuallyDefinedFailureRate(inputNumber);
      }
      if (type === NodeTypeWithManualFailureRate.External) {
        setExternalManuallyDefinedFailureRate(inputNumber);
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

      const _criticalityArray = asArray(shapeToolData?.supertypes?.criticality);
      if (_criticalityArray.length > 0) {
        setCriticality(_criticalityArray.sort().join(", "));
      } else {
        setCriticality(undefined);
      }

      const { frPrediction, frEstimate } = getFailureRates(shapeToolData);

      setSnsPredictedFailureRate(frPrediction?.value);

      const superTypes = asArray(shapeToolData?.supertypes?.behavior?.item?.supertypes);

      const filteredAtaCode = superTypes.filter((sType) => sType?.ataCode);
      const filteredPartNumber = superTypes.filter((sType) => sType?.partNumber);

      if (filteredAtaCode.length === 1 && filteredAtaCode[0].ataCode && filteredAtaCode[0].name) {
        setAtaCode(filteredAtaCode[0].ataCode);
        const altNames = asArray(filteredAtaCode[0]?.altNames);
        if (filteredAtaCode[0].ataCode === filteredAtaCode[0].name) {
          if (altNames.length > 0) setAtaNames(altNames);
        } else {
          setAtaNames([filteredAtaCode[0].name]);
        }
      } else {
        setAtaCode(undefined);
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

        if (iriOfSelectedValue === frPrediction?.iri) {
          setSelectedRadioButton(RadioButtonType.Predicted);
          setPreselectedSelectedRadioButton(RadioButtonType.Predicted);
        } else if (iriOfSelectedValue === frEstimate?.iri) {
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

      if (frPrediction?.value || frPrediction?.value === 0) {
        setSnsPredictedFailureRate(frPrediction.value);
        setSnsPredictedIri(frPrediction.iri);
      }
      if (frEstimate?.value || frEstimate?.value === 0) {
        setSnsOperationalFailureRate(frEstimate.value);
        setSnsOperationalIri(frEstimate.iri);
      }
    };

    setInitialStates();
  }, [shapeToolData, resetMenu]);

  useEffect(() => {
    setIsModified(isDirty);
  }, [isDirty]);

  const { frPrediction, frEstimate } = getFailureRates(shapeToolData);

  const isReferenceProbabilityOutdated = (shapeToolData: FaultEvent) => {
    return (
      (shapeToolData?.references?.probability || shapeToolData?.references?.probability === 0) &&
      shapeToolData?.probability !== shapeToolData?.references?.probability
    );
  };

  const propertyLabelWithHint = (propertyKey: string) => {
    return (
      <span className={classes.label}>
        {t(propertyKey + ".title")}
        <HintText hint={t(propertyKey + ".description")} />:
      </span>
    );
  };

  const propertyWithValue = (propertyKey: string, value) => {
    return (
      <>
        {propertyLabelWithHint(propertyKey)}
        <span className={classes.notEditableValue}>{value}</span>
      </>
    );
  };

  const numberValue = (value) => {
    return <Tooltip title={<span className={classes.hint}>{value}</span>}>{value.toExponential(2)}</Tooltip>;
  };

  const requiredFailureRateComponent = (failureRate, violates) => {
    const cls = violates ? classes.violated : classes.notEditableValue;
    return (
      <Typography className={classes.eventPropertyRow}>
        {propertyLabelWithHint("eventDescription.requiredFailureRate")}
        <Box className={[classes.eventPropertyRow, cls]}>
          {numberValue(failureRate)}
          {violates && warnIcon(statusMessages(t("faultEventMessage.requirementViolated")))}
        </Box>
      </Typography>
    );
  };

  const failureRateComponent = (failureRate, failureRateCode, messages: string[] = []) => {
    const _messages = asArray(messages);
    const isOutOfSync = _messages && _messages.length > 0;
    const cls = isOutOfSync ? classes.outdated : classes.notEditableValue;
    return (
      <Typography className={classes.eventPropertyRow}>
        {propertyLabelWithHint(failureRateCode)}
        <Box className={[classes.eventPropertyRow, cls]}>
          {numberValue(failureRate)}
          {isOutOfSync && syncProblemIcon(statusMessages(_messages), _messages.length)}
        </Box>
      </Typography>
    );
  };

  const fhaFailureRateComponent = (failureRate) => {
    return failureRateComponent(failureRate, "eventDescription.fhaBasedFailureRate", null);
  };

  const calculatedFailureRateComponent = (failureRate, failureRateStatusColor, statusMessages: string[]) => {
    return failureRateComponent(failureRate, "eventDescription.calculatedFailureRate", statusMessages);
  };

  const FailureRateBox = ({ value, failureRateKey, rate, selected, outdated, messageCode, newValue }) => {
    const cls = outdated ? classes.outdated : classes.notEditableValue;

    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <FormControlLabel
          value={value}
          control={<Radio style={{ color: theme.main.black }} />}
          label={propertyLabelWithHint(failureRateKey)}
          className={selected ? classes.selected : classes.notSelected}
        />
        <Box className={[classes.eventPropertyRow, cls]}>
          {numberValue(rate)}
          {outdated && syncProblemIcon(statusMessages(t(messageCode, { newValue: newValue })), 1)}
        </Box>
      </Box>
    );
  };

  const renderFailureRateBox = (rateType, rateValue, iri, selectedRadioButton, failureRateKey, messageCode) => {
    const selected = selectedRadioButton === rateType;
    const outdated = shapeToolData.probability !== rateValue && shapeToolData?.selectedEstimate?.iri === iri;
    const rate = outdated ? shapeToolData.probability : rateValue;

    return (
      <FailureRateBox
        value={rateType}
        failureRateKey={failureRateKey}
        rate={rate}
        selected={selected}
        outdated={outdated}
        messageCode={messageCode}
        newValue={outdated ? rateValue : undefined}
      />
    );
  };

  const violatesRequirement =
    shapeToolData?.probability && getRequiredFailureRate() && shapeToolData.probability > getRequiredFailureRate();

  const calculatedFailureRateStatusColor = faultTreeStatus.isOk ? theme.main.black : theme.notSynchronized.color;

  return (
    <Box paddingLeft={2} marginRight={2}>
      <ReusableFaultEventsProvider systemUri={selectedSystem?.iri}>
        <FaultEventShapeToolPane data={shapeToolData} refreshTree={refreshTree} formMethods={formMethods} />
      </ReusableFaultEventsProvider>

      {/* TODO: Finish for other nodes. Will be refactored. */}

      {/* ROOT NODE */}
      {shapeToolData && shapeToolData.iri === rootIri && (
        <>
          {shapeToolData?.probability && (
            <Box className={classes.eventPropertyRow}>
              {calculatedFailureRateComponent(
                shapeToolData.probability,
                calculatedFailureRateStatusColor,
                asArray(faultTreeStatus.statusCodes).map((c) => t(c)),
              )}
            </Box>
          )}
          {getRequiredFailureRate() && requiredFailureRateComponent(getRequiredFailureRate(), violatesRequirement)}
          {(frEstimate?.value || frEstimate?.value === 0) && (
            <Box className={classes.eventPropertyRow}>{fhaFailureRateComponent(frEstimate.value)}</Box>
          )}
        </>
      )}

      {/* EXTERNAL NODE  */}
      {shapeToolData && shapeToolData.eventType === EventType.EXTERNAL && shapeToolData.isReference && (
        <>
          {shapeToolData?.probability && (
            <Box className={classes.eventPropertyRow}>
              {calculatedFailureRateComponent(
                shapeToolData.probability,
                null,
                isReferenceProbabilityOutdated(shapeToolData)
                  ? [
                      t("faultEventMessage.referencedValueOutdated", {
                        newValue: shapeToolData?.references?.probability,
                      }),
                    ]
                  : [],
              )}
            </Box>
          )}
          {getRequiredFailureRate() && requiredFailureRateComponent(getRequiredFailureRate(), violatesRequirement)}
          {(frEstimate?.value || frEstimate?.value) && (
            <Box className={classes.eventPropertyRow}>{fhaFailureRateComponent(frEstimate.value, null, null)}</Box>
          )}
        </>
      )}

      {/* INTERMEDIATE NODE */}
      {shapeToolData && shapeToolData.eventType === EventType.INTERMEDIATE && shapeToolData.iri !== rootIri && (
        <>
          {shapeToolData?.probability && (
            <Box className={classes.eventPropertyRow}>
              {failureRateComponent(shapeToolData.probability, "eventDescription.calculatedFailureRate", [])}
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
                    frPrediction?.iri,
                    selectedRadioButton,
                    "eventDescription.predictedFailureRate",
                    "faultEventMessage.referencedValueOutdated",
                  )}
                {snsOperationalFailureRate &&
                  renderFailureRateBox(
                    RadioButtonType.Operational,
                    snsOperationalFailureRate,
                    frEstimate?.iri,
                    selectedRadioButton,
                    "eventDescription.operationalFailureRate",
                    "faultEventMessage.predictedFailureRateOutdated",
                  )}
                <Box display={"flex"} flexDirection={"row"} alignItems="center">
                  <FormControlLabel
                    value={RadioButtonType.Manual}
                    control={snsOperationalFailureRate || snsPredictedFailureRate ? <Radio /> : <></>}
                    label={propertyLabelWithHint("eventDescription.manuallyDefinedFailureRate")}
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
          <Typography className={classes.label}>
            {propertyLabelWithHint("eventDescription.manuallyDefinedFailureRate")}
          </Typography>
          <TextField
            className={classes.numberInput}
            InputLabelProps={{ shrink: false }}
            variant="outlined"
            value={externalManuallyDefinedFailureRate || ""}
            onChange={(event) => handleManuallyDefinedFailureRateChange(event, NodeTypeWithManualFailureRate.External)}
            inputProps={{ inputMode: "decimal" }}
          />
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
            {(criticality || ataCode || partNumber || stock || quantity || schematicDesignation) && (
              <Divider className={classes.divider} />
            )}
            {criticality && <Typography>{propertyWithValue("eventDescription.severity", criticality)}</Typography>}
            {ataCode && (
              <Typography>
                <span className={classes.label}>{t("faultEventMenu.ataSystem")}:</span>
                <Tooltip
                  title={
                    <Typography>
                      {ataNames?.map((n) => {
                        return <div>{n}</div>;
                      })}
                    </Typography>
                  }
                >
                  <span className={classes.notEditableValue}>{ataCode}</span>
                </Tooltip>
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
