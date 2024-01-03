import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
        return {
            root: {
                flexGrow: 1,
            },
            table: {
                minWidth: '100%',
            },
        };
    });

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;