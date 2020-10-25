export const extractFragment = (uri: string): string => {
    return uri.split('/').pop()
}