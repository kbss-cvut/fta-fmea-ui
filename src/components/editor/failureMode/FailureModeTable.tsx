import * as React from "react";
import {useEffect, useState} from "react";
import useStyles from "./FailureModeTable.styles";
import {DashboardTitleProps} from "../../dashboard/DashboardTitleProps";
import {useCurrentFailureMode} from "@hooks/useCurrentFailureMode";
import {useCurrentFailureModeComponent} from "@hooks/useCurrentFailureModeComponent";
import {Component} from "@models/componentModel";
import {DataGrid} from '@material-ui/data-grid';
import {Paper, Table, TableContainer, TableHead} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {flatten} from "lodash";

const FailureModeTable = ({setAppBarName}: DashboardTitleProps) => {
    const classes = useStyles();

    const [failureMode] = useCurrentFailureMode();
    const [component] = useCurrentFailureModeComponent();

    console.log(component)

    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    // TODO refactor - one FMEA table for component?

    const transformData = (component: Component) => {
        console.log(component)
        let maxEffectsNumber = 0;

        const rows = flatten([component.failureModes]).map(mode => {
            const row = {
                id: mode.iri,
                component: component.name,
                func: mode.influencedFunction?.name,
                failureMode: mode.name,
            }

            const flattenedEffects = flatten([mode.effects]);
            flattenedEffects.forEach((effect, index) => {
                row[`effect-${index}`] = effect.name
                maxEffectsNumber = Math.max(maxEffectsNumber, index);

                if (index === flattenedEffects.length - 1) {
                    const rpn = effect.rpn;
                    row['severity'] = rpn?.severity;
                    row['occurrence'] = rpn?.occurrence;
                    row['detection'] = rpn?.detection;

                    if(rpn?.severity && rpn?.occurrence && rpn?.detection) {
                        row['rpn'] = rpn.severity * rpn.occurrence * rpn.detection;
                    }
                }
            })

            return row;
        })

        const columns = []
        columns.push(
            {field: 'component', headerName: 'Component', flex: 1, sortable: false,},
            {field: 'func', headerName: 'Function', flex: 1, sortable: false,},
            {field: 'failureMode', headerName: 'Failure Mode', flex: 1, sortable: false,},
        );
        for (let i = 0; i <= maxEffectsNumber; i++) {
            columns.push({field: `effect-${i}`, headerName: `Effect ${i + 1}`, flex: 1, sortable: false,});
        }
        columns.push(
            {field: 'severity', headerName: 'Severity', flex: 1, sortable: false,},
            {field: 'occurrence', headerName: 'Occurrence', flex: 1, sortable: false,},
            {field: 'detection', headerName: 'Detection', flex: 1, sortable: false,},
            {field: 'rpn', headerName: 'RPN', flex: 1, sortable: false,},
        );

        setTableRows(rows);
        setTableColumns(columns);
    }


    useEffect(() => {
        setAppBarName(failureMode?.name)
    }, [failureMode])

    useEffect(() => {
        if (component) {
            transformData(component)
        }
    }, [component])

    return (<div className={classes.root}>
        <DataGrid rows={tableRows} columns={tableColumns} pageSize={5}/>
    </div>)
}

export default FailureModeTable;