import * as React from "react";
import FaultTreePathRow from "@components/dialog/faultTree/paths/FaultTreePathRow";
import {Typography} from "@material-ui/core";
import {FaultEvent} from "@models/eventModel";
import {RiskPriorityNumber} from "@models/rpnModel";
import {useFaultTreePathsAggregate} from "@hooks/useFaultTreePathsAggregate";

interface Props {
    updatePaths: (rowId: number, path: FaultEvent[]) => void,
    updateRpn: (rowId: number, rpn: RiskPriorityNumber) => void,
}

const FaultTreePathsAggregate = ({updatePaths, updateRpn}: Props) => {
    const paths = useFaultTreePathsAggregate();

    return (
        <React.Fragment>
            <Typography variant="subtitle1">Choose Effects</Typography>
            {paths && paths.map((path, index) => {
                    updatePaths(index, path);
                    return (
                        <FaultTreePathRow path={path} rowId={index}
                                          onRowChanged={(rowId, effects) => updatePaths(rowId, effects)}
                                          onRpnChanged={(rowId, rpn) => updateRpn(rowId, rpn)}/>
                    )
                }
            )}
        </React.Fragment>
    )
}

export default FaultTreePathsAggregate;