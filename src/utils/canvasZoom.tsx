const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

export const handleCanvasMouseWheel = (e, x, y, delta, paper) => {
    e.preventDefault();

    const oldScale = paper.scale().sx;
    const newScale = oldScale + delta * .1;

    scaleToPoint(newScale, x, y, paper);
};

export const scaleToPoint = (nextScale, x, y, paper) => {
    if (nextScale >= MIN_SCALE && nextScale <= MAX_SCALE) {
        const currentScale = paper.scale().sx;

        const beta = currentScale / nextScale;

        const ax = x - (x * beta);
        const ay = y - (y * beta);

        const translate = paper.translate();

        const nextTx = translate.tx - ax * nextScale;
        const nextTy = translate.ty - ay * nextScale;

        paper.translate(nextTx, nextTy);

        const ctm = paper.matrix();

        ctm.a = nextScale;
        ctm.d = nextScale;

        paper.matrix(ctm);
    }
};