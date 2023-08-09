import * as React from "react";
import {useEffect, useState} from "react";
import useStyles from "./FailureModeTable.styles";
import {DashboardTitleProps} from "../../dashboard/DashboardTitleProps";
import {useCurrentFailureModesTable} from "@hooks/useCurrentFailureModesTable";
import {DataGrid} from '@mui/x-data-grid';
import {Button} from "@mui/material";
import FailureModesRowEditDialog from "@components/dialog/failureModesRow/FailureModesRowEditDialog";
import {EditRowRpn} from "@models/failureModesRowModel";
import {Mitigation} from "@models/mitigationModel";
import {FailureMode} from "@models/failureModeModel";

const FailureModeTable = ({setAppBarName}: DashboardTitleProps) => {
    const { classes } = useStyles();

    const [tableData, refreshTable] = useCurrentFailureModesTable();

    const [tableColumns, setTableColumns] = useState([]);
    const [tableRows, setTableRows] = useState([]);

    const [selectedRpnRow, setSelectedRpnRow] = useState(null);
    const [selectedMitigation, setSelectedMitigation] = useState(null);
    const [failureModes, setFailureModes] = useState<FailureMode[]>([]);
    useEffect(() => {
        if (tableData) {
            setAppBarName(tableData?.name);

            (tableData.columns as any[]).push({
                field: "",
                headerName: "Edit",
                sortable: false,
                flex: 1,
                align: "center",
                disableClickEventBubbling: true,
                renderCell: (params) => {
                    const onClick = () => {
                        const rowData = params.data;

                        const editRpnRow = {
                            uri: rowData.rowId,
                            severity: rowData.severity,
                            occurrence: rowData.occurrence,
                            detection: rowData.detection,
                            mitigationUri: rowData.mitigationId,
                        } as EditRowRpn;

                        setSelectedRpnRow(editRpnRow);

                        const mit = {
                            iri: rowData.mitigationId,
                            name: rowData.mitigation,
                            description: rowData.mitigationDescription,
                        } as Mitigation;

                        setSelectedMitigation(mit)
                    };

                    return <Button onClick={onClick}>Edit</Button>;
                }
            });

            setFailureModes(tableData.failureModes)
            setTableColumns(tableData.columns)
            setTableRows(tableData.rows);
        }
    }, [tableData]);

    return (<div className={classes.root}>
        {/*TODO: This probably forces the data grid be on the first page only*/}
        <DataGrid rows={tableRows} columns={tableColumns} paginationModel={{page: 1, pageSize: 20}} />

        <FailureModesRowEditDialog
            open={Boolean(selectedRpnRow)} handleCloseDialog={() => setSelectedRpnRow(null)}
            rowRpn={selectedRpnRow} onSuccess={refreshTable} mitigation={selectedMitigation} failureModes={failureModes}/>
    </div>)
}

export default FailureModeTable;