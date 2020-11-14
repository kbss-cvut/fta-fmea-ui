import * as _ from "lodash";

export const deepOmit = (obj, keysToOmit) => {
    const keysToOmitIndex = _.keyBy(Array.isArray(keysToOmit) ? keysToOmit : [keysToOmit]);

    const omitFromObject = (obj) => {
        return _.transform(obj, (result, value, key) => {
            if (key in keysToOmitIndex) {
                return;
            }

            result[key] = value !== null && typeof value === 'object' ? omitFromObject(value) : value;
        })
    }

    return omitFromObject(obj);
}

