import * as React from "react";

import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { useForm } from "react-hook-form";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateFailureModesTable } from "@models/failureModesTableModel";
import * as failureModesTableService from "@services/failureModesTableService";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import { FaultEvent } from "@models/eventModel";
import { RiskPriorityNumber } from "@models/rpnModel";
import { schema } from "../FailureModesTableDialog.schema";
import { FaultTreePathsAggregateProvider } from "@hooks/useFaultTreePathsAggregate";
import FaultTreePathsAggregate from "../../faultTree/pathsAggregate/FaultTreePathsAggregate";
import { useFailureModesTables } from "@hooks/useFailureModesTables";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FailureModesTableAggregateDialog = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [showSnackbar] = useSnackbar();
  const [, , , addTableAggregate] = useFailureModesTables();

  const useFormMethods = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useFormMethods;

  const selectedPathsMap = new Map<number, FaultEvent[]>();
  const selectedRPNsMap = new Map<number, RiskPriorityNumber>();

  const handleConversion = (values: any) => {
    const tableRows = failureModesTableService.eventPathsToRows(selectedPathsMap, selectedRPNsMap);

    const table = {
      name: values.fmeaName,
      rows: tableRows,
    } as CreateFailureModesTable;

    failureModesTableService
      .createAggregate(table)
      .then((value) => {
        addTableAggregate(value);
        onClose();
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  const updatePaths = (rowId: number, path: FaultEvent[]) => {
    selectedPathsMap.set(rowId, path);
  };

  const updateRpn = (rowId: number, rpn: RiskPriorityNumber) => {
    selectedRPNsMap.set(rowId, rpn);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth scroll="paper">
        <DialogTitle id="form-dialog-title" onClose={onClose}>
          {t("newFmeaModal.title")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label={t("newFmeaModal.namePlaceholder")}
            name="fmeaName"
            type="text"
            fullWidth
            error={!!errors.fmeaName}
            {...register("fmeaName")}
            helperText={errors.fmeaName?.message}
          />
          <FaultTreePathsAggregateProvider>
            <FaultTreePathsAggregate updatePaths={updatePaths} updateRpn={updateRpn} />
          </FaultTreePathsAggregateProvider>
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleConversion)}>
            {t("newFmeaModal.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FailureModesTableAggregateDialog;
