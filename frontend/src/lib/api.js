export async function apiPost(url, form) {
    let res;
    try {
        res = await fetch(url, { method: 'POST', body: form });
    } catch {
        throw new Error('Could not reach the server. Is the backend running?');
    }
    let json;
    try {
        json = await res.json();
    } catch {
        throw new Error(`Unexpected response from server (${res.status})`);
    }
    if (!res.ok || json.error) {
        throw new Error(json.error || `Request failed (${res.status})`);
    }
    return json;
}

export function dataUrlToBlob(dataUrl) {
    const [meta, b64] = dataUrl.split(',');
    const mime = (meta.match(/data:(.*?);/) || [])[1] || 'application/octet-stream';
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

export function downloadDataUrl(dataUrl, fileName) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export function makeUploadForm(file, extraFields = {}, fieldName = 'image') {
    const form = new FormData();
    form.append(fieldName, file);
    Object.entries(extraFields).forEach(([key, value]) => {
        form.append(key, value);
    });
    return form;
}
