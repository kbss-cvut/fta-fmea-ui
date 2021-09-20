import * as React from "react";
import { useFailureMode} from "@hooks/useFailureModes";
import {Checkbox, InputLabel, ListItemText, MenuItem, Select} from "@material-ui/core";
import {FailureMode} from "../../../models/failureModeModel";
import {formatOutput} from "@utils/formatOutputUtils";
import {useEffect} from "react";

interface Props {
    functionFailureModes: FailureMode[],
    selectedFailureModes: FailureMode[],
    setSelectedFailureModes: (arg) => void
}

const FailureModesList = ({functionFailureModes,selectedFailureModes, setSelectedFailureModes}: Props ) => {
    const [allFailureModes] = useFailureMode()

    const handleChange = (event) => {
        setSelectedFailureModes(event.target.value)
    }

    useEffect(()=>{

        if (!Array.isArray(functionFailureModes) && functionFailureModes != null) {
            functionFailureModes = [functionFailureModes]
        }

        (functionFailureModes || []).forEach(failureMode => {
            selectedFailureModes.push(allFailureModes.find(fm => fm.iri == failureMode.iri))
        })
    },[])

    return (
        <React.Fragment>
            <InputLabel shrink={selectedFailureModes.length != 0} id="failure-modes-multiselect-label"> Failure modes:</InputLabel>
            <Select
                labelId="failure-modes-multiselect-label"
                id="failure-modes-multiselect"
                multiple
                value={selectedFailureModes}
                onChange={handleChange}
                renderValue={(selected: any[]) => formatOutput(selected.map(value => value.name).join(", "), 65)}
            >
                {(allFailureModes || []).map((failureMode) =>
                    //@ts-ignore
                    <MenuItem key={failureMode.iri} value={failureMode}>
                        <Checkbox checked={selectedFailureModes.includes(failureMode)}/>
                        <ListItemText primary={failureMode.name + " (" + failureMode.component.name + ")"}/>
                    </MenuItem>
                )}
            </Select>
        </React.Fragment>
    );
}

export default FailureModesList;