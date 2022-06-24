import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as documentService from "@services/documentService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {DocumentModel} from "@models/documentModel";


type documentContextType = [DocumentModel[], (systemUri: string, documentId: string) => Promise<void>];

export const documentContext = createContext<documentContextType>(null!);

export const useDocuments = () => {
    const [documents, importDocument] = useContext(documentContext);
    return [documents, importDocument] as const;
}

export const DocumentProvider = ({children}: ChildrenProps) => {
    const [_documents, _setDocuments] = useState<DocumentModel[]>([]);
    const [showSnackbar] = useSnackbar()

    const importDocument = async (systemUri, documentId): Promise<void> =>{
        return documentService.importDocument(systemUri, documentId)
    }

    useEffect(() => {
        const fetchDocuments = async () => {
            documentService.findAll()
                .then(documents => _setDocuments(documents))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchDocuments()
        return () => {
            axiosSource.cancel("ComponentsProvider - unmounting")
        }
    }, []);

    return (
        <documentContext.Provider value={[_documents, importDocument]}>
            {children}
        </documentContext.Provider>
    );
}