import * as _ from 'lodash';

export const _computeDimensions = (label: string): number[] => {
    var maxLineLength = _.max(label.split('\n'), function(l) { return l.length; }).length;

// Compute width/height of the rectangle based on the number
// of lines in the label and the letter size. 0.6 * letterSize is
// an approximation of the monospace font letter width.
    const letterSize = 8;
    const width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    const height = 2 * ((label.split('\n').length + 1) * letterSize);

    return [width, height, letterSize]
}