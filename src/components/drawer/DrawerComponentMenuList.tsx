import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {useState} from "react";
import {Component} from "@models/componentModel";
import {TreeView} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import useStyles from "@components/drawer/DrawerComponentMenuList.styles";
import CreateComponentDialog from "@components/dialog/CreateComponentDialog";
import {useComponents} from "@hooks/useComponents";

const DrawerComponentMenuList = () => {
    const classes = useStyles();

    const [createComponentDialogOpen, setCreateComponentDialogOpen] = useState(false);
    const [components] = useComponents()

    const closeDialog = () => {
        setCreateComponentDialogOpen(false)
    }

    return (
        <div className={classes.menu}>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
            >
                {
                    components.map((value: Component) => (
                        <TreeItem className={classes.treeItem} key={value.iri} nodeId={value.iri} label={value.name}/>
                    ))
                }
            </TreeView>
            <Button className={classes.componentButton} variant="contained" color="primary" startIcon={<AddIcon/>}
                    onClick={() => setCreateComponentDialogOpen(true)}>
                New Component
            </Button>

            <CreateComponentDialog open={createComponentDialogOpen} handleCloseDialog={closeDialog}/>
        </div>
    );
}

export default DrawerComponentMenuList;