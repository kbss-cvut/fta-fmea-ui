export const encodeCanvas = (svgPaper) => {
    const svgData = new XMLSerializer().serializeToString(svgPaper);
    return btoa(unescape(encodeURIComponent(svgData)));
};