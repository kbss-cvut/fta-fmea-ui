import {Button, Card, CardActions, CardHeader, Grid, GridList, GridListTile, IconButton} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import {useFailureModes} from "@hooks/useFailureModes";
import useStyles from "@components/dashboard/content/list/DashboardList.styles";

const DashboardFailureModeList = () => {
    const classes = useStyles();
    const failureModes = useFailureModes();

    return (
        <GridList className={classes.gridList} cols={6}>
            {failureModes.map((fm) => (
                <GridListTile key={fm.iri} className={classes.gridListTile}>
                    <Card className={classes.card}>
                        <CardHeader
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon/>
                                </IconButton>
                            }
                            title={fm.name}
                        />
                        <CardActions disableSpacing>
                            <Button color="primary">Open</Button>
                        </CardActions>
                    </Card>
                </GridListTile>
            ))}
        </GridList>
    );
}

export default DashboardFailureModeList;