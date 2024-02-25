import * as React from "react";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, Tooltip } from "@mui/material";
import { formatFunctionOutput, formatOutput } from "@utils/formatOutputUtils";
import { useFunctions } from "@hooks/useFunctions";
import { FailureMode } from "@models/failureModeModel";
import useStyles from "@components/editor/system/menu/function/ComponentFunctionsList.styles";

interface FunctionListProps {
  label: string;
  selectedFunctions: FailureMode[];
  setSelectedFunctions: (arg) => void;
  transitiveClosure: string[];
}

const FunctionsList = ({ label, selectedFunctions, setSelectedFunctions, transitiveClosure }: FunctionListProps) => {
  const [, , , , , allFunctions] = useFunctions();
  const { classes } = useStyles();
  const ref = React.useRef();

  const handleChange = (event) => {
    setSelectedFunctions(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={label + "_label"}> {label} </InputLabel>
      <Select
        labelId={label + "_label"}
        id={label + "_multiselect"}
        multiple
        value={selectedFunctions}
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
            50,
          )
        }
      >
        {allFunctions.map((f) => (
          //@ts-ignore
          <MenuItem key={f.iri} value={f} className={transitiveClosure.includes(f.iri) ? classes.closure : ""}>
            <Checkbox checked={!!selectedFunctions.includes(f)} />
            <Tooltip
              disableFocusListener
              title={f.name + (f.component != null ? " (" + f.component.name + ")" : " (None)")}
            >
              <ListItemText primary={formatFunctionOutput(f, f.component)} />
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FunctionsList;
