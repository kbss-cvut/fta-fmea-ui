import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            root: {
                display: "flex",
                flexFlow: "column",
                height: "100vh"
            }
        })
    }
);

export default useStyles;