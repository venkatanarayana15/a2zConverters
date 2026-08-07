export const isBrowserSupported = () => {
    try {
        if (typeof Iterator === 'undefined') return false;
        if (typeof Promise.withResolvers !== 'function') return false;
        if (typeof structuredClone !== 'function') return false;
        if (!('replaceAll' in String.prototype)) return false;
    } catch {
        return false;
    }
    return true;
};
