import * as React from "react";
import {useEffect, useState} from "react";
import MultipleSelectChips from "@components/materialui/select/MultipleSelectChips";
import {FaultEvent} from "@models/eventModel";
import {flatten} from "lodash";

interface Props {
    path: FaultEvent[],
    rowId: number,
    onRowChanged: (rowId: number, effects: FaultEvent[]) => void,
}

const FaultTreePathRow = ({path, rowId, onRowChanged}: Props) => {
    const [value, setValue] = useState(path)
    const [error, setError] = useState("")

    const options = flatten([path]).map(item => {
        return {label: item.name, value: item}
    }) as any[];

    const handleChange = (value) => {
        setValue(value);
        onRowChanged(rowId, value);
    }

    return (
        <MultipleSelectChips
            value={value}
            setValue={handleChange}
            options={options}
            error={error}
            setError={setError}
        />
    )
}

export default FaultTreePathRow;
