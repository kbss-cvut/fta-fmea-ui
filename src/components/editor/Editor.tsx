import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import {useSnackbar} from "@hooks/useSnackbar";
import EditorCanvas from "@components/editor/canvas/EditorCanvas";

interface EditorPros {
    failureMode: FailureMode,
    exportImage: (string) => void
}

const Editor = ({failureMode, exportImage}: EditorPros) => {
    const [showSnackbar] = useSnackbar()

    return (
        <EditorCanvas
            failureMode={failureMode}
            exportImage={exportImage}
        />
    );
}

export default Editor;