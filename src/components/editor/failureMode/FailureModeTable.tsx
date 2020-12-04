import * as React from "react";
import {useEffect, useState} from "react";
import useStyles from "./FailureModeTable.styles";
import {DashboardTitleProps} from "../../dashboard/DashboardTitleProps";
import {useCurrentFailureModesTable} from "@hooks/useCurrentFailureModesTable";
import {CellParams, ColDef, DataGrid, GridApi} from '@material-ui/data-grid';
import {Button} from "@material-ui/core";
import FailureModesRowEditDialog from "@components/dialog/failureModesRow/FailureModesRowEditDialog";
import {EditRowRpn} from "@models/failureModesRowModel";

const FailureModeTable = ({setAppBarName}: DashboardTitleProps) => {
    const classes = useStyles();

    const [tableData, refreshTable] = useCurrentFailureModesTable();

    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    const [selectedRpnRow, setSelectedRpnRow] = useState(null);

    useEffect(() => {
        if (tableData) {
            setAppBarName(tableData?.name);

            (tableData.columns as ColDef[]).push({
                field: "",
                headerName: "Edit",
                sortable: false,
                flex: 1,
                align: "center",
                disableClickEventBubbling: true,
                renderCell: (params: CellParams) => {
                    const onClick = () => {
                        const rowData = params.data;

                        const editRpnRow = {
                            uri: rowData.rowId,
                            severity: rowData.severity,
                            occurrence: rowData.occurrence,
                            detection: rowData.detection,
                        } as EditRowRpn;

                        setSelectedRpnRow(editRpnRow);
                    };

                    return <Button onClick={onClick}>Edit</Button>;
                }
            });


            setTableColumns(tableData.columns);
            setTableRows(tableData.rows);
        }
    }, [tableData]);

    return (<div className={classes.root}>
        <DataGrid rows={tableRows} columns={tableColumns} pageSize={20}/>

        <FailureModesRowEditDialog
            open={Boolean(selectedRpnRow)} handleCloseDialog={() => setSelectedRpnRow(null)}
            rowRpn={selectedRpnRow} onSuccess={refreshTable}/>
    </div>)
}

export default FailureModeTable;