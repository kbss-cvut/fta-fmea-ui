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
import { syncProblemIcon, warnIcon } from "@components/Icons";
import HintText from "@components/hintText/HintText";
import { calculationStatusMessages } from "@components/fta/FTAStatus";
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

  const [criticality, setCriticality] = useState<number | undefined>(0);
  const [ataSystem, setAtaSystem] = useState<string | undefined>("");
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

      if (shapeToolData?.supertypes?.criticality) {
        setCriticality(shapeToolData.supertypes.criticality);
      } else {
        setCriticality(undefined);
      }

      const types = asArray(shapeToolData?.supertypes?.supertypes);

      const filteredFailureRate = types.filter((type) => type.hasFailureRate);

      if (filteredFailureRate.length === 1 && filteredFailureRate[0].hasFailureRate?.prediction?.value) {
        setSnsPredictedFailureRate(filteredFailureRate[0].hasFailureRate?.prediction?.value);
      } else {
        setSnsPredictedFailureRate(undefined);
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
  const { predictionIri, operationalIri } = getFailureRateIris(shapeToolData?.supertypes?.supertypes);

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

  const numberValue = (value, cls = classes.notEditableValue) => {
    return <Tooltip title={<span className={classes.hint}>{value}</span>}>{value.toExponential(2)}</Tooltip>;
  };

  const requiredFailureRateComponent = (failureRate, requirementStatusColor, violates) => {
    const cls = violates ? classes.violated : classes.notEditableValue;
    return (
      <Typography className={classes.eventPropertyRow}>
        {propertyLabelWithHint("eventDescription.requiredFailureRate")}
        <Box className={[classes.eventPropertyRow, cls]}>
          {numberValue(failureRate)}
          {violates &&
            warnIcon(calculationStatusMessages("faultEventMessage.requirementViolated", t), requirementStatusColor)}
        </Box>
      </Typography>
    );
  };

  const failureRateComponent = (failureRate, failureRateCode, statusCodes: string[] = []) => {
    const isOutOfSync = statusCodes && statusCodes.length > 0;
    const cls = isOutOfSync ? classes.outdated : classes.notEditableValue;
    return (
      <Typography className={classes.eventPropertyRow}>
        {propertyLabelWithHint(failureRateCode)}
        <Box className={[classes.eventPropertyRow, cls]}>
          {numberValue(failureRate)}
          {isOutOfSync && syncProblemIcon(calculationStatusMessages(statusCodes, t), statusCodes.length)}
        </Box>
      </Typography>
    );
  };

  const fhaFailureRateComponent = (failureRate, failureRateStatusColor, faultTreeStatus: FaultTreeStatus) => {
    return failureRateComponent(
      failureRate,
      "eventDescription.fhaBasedFailureRate",
      failureRateStatusColor,
      faultTreeStatus,
    );
  };

  const calculatedFailureRateComponent = (failureRate, failureRateStatusColor, statusCodes: string[]) => {
    return failureRateComponent(failureRate, "eventDescription.calculatedFailureRate", statusCodes);
  };

  const FailureRateBox = ({ value, failureRateKey, rate, selected, outdated }) => (
    <Box display="flex" flexDirection="row" alignItems="center">
      <FormControlLabel
        value={value}
        control={<Radio style={{ color: theme.main.black }} />}
        label={propertyLabelWithHint(failureRateKey)}
        className={selected ? classes.selected : classes.notSelected}
      />
      <Tooltip title={<span className={classes.hint}>{rate}</span>}>
        <Typography className={outdated ? classes.outdated : classes.notEditableValue}>
          {rate.toExponential(2)}
        </Typography>
      </Tooltip>
    </Box>
  );

  const renderFailureRateBox = (rateType, rateValue, iri, selectedRadioButton, failureRateKey) => {
    const rate =
      shapeToolData.probability !== rateValue && shapeToolData?.selectedEstimate?.iri === iri
        ? shapeToolData.probability
        : rateValue;
    const selected = selectedRadioButton === rateType;
    const outdated = selected && shapeToolData.probability !== rateValue;

    return (
      <FailureRateBox
        value={rateType}
        failureRateKey={failureRateKey}
        rate={rate}
        selected={selected}
        outdated={outdated}
      />
    );
  };

  const violatesRequirement =
    shapeToolData?.probability && getRequiredFailureRate() && shapeToolData.probability > getRequiredFailureRate();

  const requiredFailureRateStatusColor = violatesRequirement ? theme.requirementViolation.color : theme.main.black;

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
          {basedFailureRate && (
            <Box className={classes.eventPropertyRow}>{fhaFailureRateComponent(basedFailureRate, null, null)}</Box>
          )}
          {getRequiredFailureRate() &&
            requiredFailureRateComponent(getRequiredFailureRate(), requiredFailureRateStatusColor, violatesRequirement)}
          {shapeToolData?.probability && (
            <Box className={classes.eventPropertyRow}>
              {calculatedFailureRateComponent(
                shapeToolData.probability,
                calculatedFailureRateStatusColor,
                faultTreeStatus.statusCodes,
              )}
            </Box>
          )}
          <Divider className={classes.divider} />
        </>
      )}

      {/* EXTERNAL NODE  */}
      {shapeToolData && shapeToolData.eventType === EventType.EXTERNAL && shapeToolData.isReference && (
        <>
          {basedFailureRate && (
            <Box className={classes.eventPropertyRow}>{fhaFailureRateComponent(basedFailureRate, null, null)}</Box>
          )}
          {getRequiredFailureRate() &&
            requiredFailureRateComponent(getRequiredFailureRate(), requiredFailureRateStatusColor, violatesRequirement)}
          {shapeToolData?.probability && (
            <Box className={classes.eventPropertyRow}>
              {calculatedFailureRateComponent(
                shapeToolData.probability,
                null,
                isReferenceProbabilityOutdated(shapeToolData) ? ["faultEventMessage.referencedValueOutdated"] : [],
              )}
            </Box>
          )}
          <Divider className={classes.divider} />
        </>
      )}

      {/* INTERMEDIATE NODE */}
      {shapeToolData && shapeToolData.eventType === EventType.INTERMEDIATE && shapeToolData.iri !== rootIri && (
        <>
          {shapeToolData?.probability && (
            <Box className={classes.eventPropertyRow}>
              {failureRateComponent(shapeToolData.probability, theme.main.black, [])}
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
                    "eventDescription.predictedFailureRate",
                  )}
                {snsOperationalFailureRate &&
                  renderFailureRateBox(
                    RadioButtonType.Operational,
                    snsOperationalFailureRate,
                    operationalIri,
                    selectedRadioButton,
                    "eventDescription.operationalFailureRate",
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
            {criticality && <Typography>{propertyWithValue("eventDescription.severity", criticality)}</Typography>}
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
