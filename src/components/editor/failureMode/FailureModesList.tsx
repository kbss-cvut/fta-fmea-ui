import * as React from "react";
import { useEffect, useState } from "react";
import { useFailureMode } from "@hooks/useFailureModes";
import { Checkbox, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";
import { FailureMode, FailureModeType } from "@models/failureModeModel";
import { formatOutput } from "@utils/formatOutputUtils";
import { useFunctions } from "@hooks/useFunctions";
import useStyles from "@components/editor/system/menu/failureMode/ComponentFailureModesList.styles";

interface Props {
  label: string;
  allowCauses: boolean;
  functionIri: string;
  selectedFailureModes: FailureMode[];
  setSelectedFailureModes: (arg) => void;
  setCurrentFailureModes: (arg) => void;
  transitiveClosure: string[];
}

const FailureModesList = ({
  label,
  allowCauses,
  functionIri,
  selectedFailureModes,
  setSelectedFailureModes,
  setCurrentFailureModes,
  transitiveClosure,
}: Props) => {
  const { classes } = useStyles();
  const [allFailureModes] = useFailureMode();
  const [, , , , , , , getFailureModes] = useFunctions();

  const [failureModes, setFailureModes] = useState<FailureMode[]>([]);

  const handleChange = (event) => {
    setSelectedFailureModes(event.target.value);
  };

  useEffect(() => {
    if (functionIri != "") {
      getFailureModes(functionIri).then((failureModes) => {
        setSelectedFailureModes([...selectedFailureModes, ...failureModes.map((fm) => allFailureModes.get(fm.iri))]);
        setCurrentFailureModes(failureModes);
      });
    }
  }, []);

  useEffect(() => {
    const fms = Array.from(allFailureModes.values());
    setFailureModes(allowCauses ? fms : fms.filter((fm) => fm.failureModeType === FailureModeType.FailureMode));
  }, [allFailureModes]);

  return (
    <React.Fragment>
      <InputLabel shrink={selectedFailureModes.length != 0} id="failure-modes-multiselect-label">
        {" "}
        {label}{" "}
      </InputLabel>
      <Select
        labelId="failure-modes-multiselect-label"
        id="failure-modes-multiselect"
        multiple
        value={selectedFailureModes}
        MenuProps={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          classes: { paper: classes.menuPaper },
        }}
        onChange={handleChange}
        renderValue={(selected: any[]) =>
          formatOutput(
            selected
              .filter((v) => v)
              .map((value) => value.name)
              .join(", "),
            65,
          )
        }
      >
        {failureModes.map((failureMode) => (
          //@ts-ignore
          <MenuItem
            key={failureMode.iri}
            value={failureMode}
            className={transitiveClosure.includes(failureMode.iri) ? classes.closure : ""}
          >
            <Checkbox checked={selectedFailureModes.includes(failureMode)} />
            <ListItemText
              primary={
                failureMode.name +
                " (" +
                (failureMode.component !== undefined ? failureMode.component.name : "None") +
                ")"
              }
            />
          </MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );
};

export default FailureModesList;
