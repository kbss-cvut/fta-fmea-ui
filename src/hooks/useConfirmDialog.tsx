import * as React from "react";
import {createContext, useContext, useState} from "react";
import {ChildrenProps} from "@utils/hookUtils";
import ConfirmDialog from "../components/dialog/ConfirmDialog";

interface ConfirmDialogProps {
    title: string,
    explanation: string,
    onConfirm: () => void,
}

type confirmDialogContextType = [(UseConfirmDialogProps) => void];

const confirmDialogContext = createContext<confirmDialogContextType>(null!);

export const useConfirmDialog = () => {
    const [showConfirmDialog] = useContext(confirmDialogContext);
    return [showConfirmDialog] as const;
}

export const ConfirmDialogProvider = ({children}: ChildrenProps) => {
    const [_open, _setOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | null>();

    const showConfirmDialog = (data: ConfirmDialogProps) => {
        setDialogProps(data)
        _setOpen(true)
    }

    return (
        <confirmDialogContext.Provider value={[showConfirmDialog]}>
            {children}
            {dialogProps && <ConfirmDialog
                title={dialogProps?.title}
                explanation={dialogProps?.explanation}
                onConfirm={dialogProps?.onConfirm}
                open={_open}
                onClose={() => _setOpen(false)}/>}
        </confirmDialogContext.Provider>
    );
}