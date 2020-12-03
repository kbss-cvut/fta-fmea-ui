import * as React from "react";
import {useEffect, useState} from "react";
import useStyles from "./FailureModeTable.styles";
import {DashboardTitleProps} from "../../dashboard/DashboardTitleProps";
import {useCurrentFailureModesTable} from "@hooks/useCurrentFailureModesTable";
import {DataGrid} from '@material-ui/data-grid';

const FailureModeTable = ({setAppBarName}: DashboardTitleProps) => {
    const classes = useStyles();

    const tableData = useCurrentFailureModesTable();

    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    useEffect(() => {
        if (tableData) {
            setAppBarName(tableData?.name);
            setTableColumns(tableData.columns);
            setTableRows(tableData.rows);
        }
    }, [tableData]);

    return (<div className={classes.root}>
        <DataGrid rows={tableRows} columns={tableColumns} pageSize={20}/>
    </div>)
}

export default FailureModeTable;