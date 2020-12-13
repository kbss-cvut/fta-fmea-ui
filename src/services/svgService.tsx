import axiosClient from "./utils/axiosUtils";
import {authHeaders} from "./utils/authUtils";
import {handleServerError} from "./utils/responseUtils";

export const exportPng = async (svgString: string, name: string): Promise<string> => {
    try {
        const request = {
            data: new Buffer(svgString).toString('base64')
        }

        const response = await axiosClient.put(
            '/svg/convert',
            request,
            {
                headers: authHeaders()
            }
        );

        const type = response.headers['content-type']
        const decodedPng = atob(response.data)
        const byteNumbers = new Array(decodedPng.length);
        for (let i = 0; i < decodedPng.length; i++) {
            byteNumbers[i] = decodedPng.charCodeAt(i);
        }
        const blob = new Blob([new Uint8Array(byteNumbers)], { type: type})
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = (name) ? name : 'diagram' + ".png";
        link.click()
    } catch (e) {
        console.log('SVG Service - Failed to call /exportPng')
        const defaultMessage = "Failed to export fault tree";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}