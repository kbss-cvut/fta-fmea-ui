import {useRef} from "react";

export const useLocalContext = data => {
    const ctx = useRef(data)
    ctx.current = data
    return ctx
}