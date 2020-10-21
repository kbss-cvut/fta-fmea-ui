import * as React from "react";

import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {useState} from "react";
import * as componentService from "@services/componentService"
import {useEffectAsync} from "@utils/hookUtils";
import {Component} from "@models/componentModel";
import {TreeView} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import useStyles from "@components/drawer/DrawerComponentMenuList.styles";
import CreateComponentDialog from "@components/dialog/CreateComponentDialog";

const DrawerComponentMenuList = () => {
    const classes = useStyles();
    const [components, setComponents] = useState([])

    const [createComponentDialogOpen, setCreateComponentDialogOpen] = useState(false);

    useEffectAsync(async () => {
        const componentList = await componentService.findAll();
        console.log(componentList);
        setComponents(componentList)
    }, []);

    const handleCreateComponent = () => {
        setCreateComponentDialogOpen(true)
    }
    const closeDialog = () => {
        setCreateComponentDialogOpen(false)
    }

    const handleComponentCreated = (component: Component) => {
        setCreateComponentDialogOpen(false)
        if (component) {
            setComponents([...components, component])
        }
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
                    onClick={handleCreateComponent}>
                New Component
            </Button>

            <CreateComponentDialog handleComponentCreated={handleComponentCreated}
                                   dialogOpen={createComponentDialogOpen}
                                   handleCloseDialog={closeDialog}/>
        </div>
    );
}

export default DrawerComponentMenuList;