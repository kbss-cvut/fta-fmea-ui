import * as React from "react";
import {useFaultTreePaths} from "@hooks/useFaultTreePaths";
import FaultTreePathRow from "@components/dialog/faultTree/paths/FaultTreePathRow";
import {Typography} from "@material-ui/core";
import {FaultEvent} from "@models/eventModel";

interface Props {
    updatePaths: (rowId: number, path: FaultEvent[]) => void,
}

const FaultTreePaths = ({updatePaths}: Props) => {
    const paths = useFaultTreePaths();

    return (
        <React.Fragment>
            <Typography variant="subtitle1">Choose Effects</Typography>
            {paths && paths.map((path, index) => {
                    updatePaths(index, path);
                    return (<FaultTreePathRow path={path} rowId={index}
                                              onRowChanged={(rowId, effects) => updatePaths(rowId, effects)}
                    />)
                }
            )}
        </React.Fragment>
    )
}

export default FaultTreePaths;