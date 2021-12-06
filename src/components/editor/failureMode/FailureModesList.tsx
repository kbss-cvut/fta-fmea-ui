import * as React from "react";
import {useFailureMode} from "@hooks/useFailureModes";
import {Checkbox, InputLabel, ListItemText, MenuItem, Select} from "@material-ui/core";
import {FailureMode} from "@models/failureModeModel";
import {formatOutput} from "@utils/formatOutputUtils";
import {useEffect} from "react";
import {useFunctions} from "@hooks/useFunctions";

interface Props {
    label: string,
    functionIri: string,
    selectedFailureModes: FailureMode[],
    setSelectedFailureModes: (arg) => void,
    setCurrentFailureModes: (arg) => void
}

const FailureModesList = ({   label,
                              functionIri,
                              selectedFailureModes,
                              setSelectedFailureModes,
                              setCurrentFailureModes
                          }: Props) => {
    const [allFailureModes] = useFailureMode()
    const [, , , , , , , , getFailureModes] = useFunctions()


    const handleChange = (event) => {
        setSelectedFailureModes(event.target.value)
    }

    useEffect(() => {
        if (functionIri != "") {
            getFailureModes(functionIri)
                .then(failureModes => {
                    failureModes.forEach(failureMode=>{
                        selectedFailureModes.push(allFailureModes.get(failureMode.iri))
                    })
                    setCurrentFailureModes(failureModes)
                })
        }
    }, [])

    return (
        <React.Fragment>
            <InputLabel shrink={selectedFailureModes.length != 0} id="failure-modes-multiselect-label"> {label} </InputLabel>
            <Select
                labelId="failure-modes-multiselect-label"
                id="failure-modes-multiselect"
                multiple
                value={selectedFailureModes}
                onChange={handleChange}
                renderValue={(selected: any[]) => formatOutput(selected.map(value => value.name).join(", "), 65)}
            >

                {(Array.from(allFailureModes.values())).map((failureMode) =>
                    //@ts-ignore
                    <MenuItem key={failureMode.iri} value={failureMode}>
                        <Checkbox checked={selectedFailureModes.includes(failureMode)}/>
                        <ListItemText primary={failureMode.name + " (" + (failureMode.component !== undefined ? failureMode.component.name : "None") + ")"}/>
                    </MenuItem>
                )}
            </Select>
        </React.Fragment>
    );
}

export default FailureModesList;