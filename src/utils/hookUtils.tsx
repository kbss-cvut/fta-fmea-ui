import {useEffect} from 'react';

export const useEffectAsync = (effect, inputs = []) => {
    useEffect(() => {
        effect();
    }, inputs);
}