// Default payloads fallback (used if no list.json/list.txt present)
const DEFAULT_PAYLOADS = [
    "ps4-app2usb-main.bin",
    "ps4-backup-main.bin",
    "ps4-disable-updates-main.bin",
    "ps4-enable-browser-main.bin",
    "ps4-enable-updates-main.bin",
    "ps4-fan-threshold-main.bin",
    "ps4-ftp-main.bin",
    "ps4-history-blocker-main.bin",
    "ps4-kernel-dumper-main.bin",
    "ps4-restore-main.bin",
    "ps4-rif-renamer-main.bin"
];

let PAYLOADS = [];
let PAYLOADS_BASE_PATH = "payloads/";

async function loadRemoteJson(paths) {
    for (const p of paths) {
        try {
            const res = await fetch(p, { cache: 'no-store' });
            if (!res.ok) continue;
            const data = await res.json();
            if (Array.isArray(data) && data.length) {
                PAYLOADS_BASE_PATH = p.startsWith('payloades/') ? 'payloades/' : 'payloads/';
                return data;
            }
        } catch (e) { }
    }
    return null;
}

async function loadRemoteList(paths) {
    for (const p of paths) {
        try {
            const res = await fetch(p, { cache: 'no-store' });
            if (!res.ok) continue;
            const txt = await res.text();
            const files = txt.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            if (files.length) {
                PAYLOADS_BASE_PATH = p.replace(/list\.txt$/, '');
                return files;
            }
        } catch (e) { }
    }
    return null;
}

async function populatePayloads() {
    // Try modern JSON first
    const jsonPaths = ['payloads/payloads.json', 'payloades/payloads.json'];
    const listPaths = ['payloads/list.txt', 'payloades/list.txt'];
    const jsonRes = await loadRemoteJson(jsonPaths);
    if (jsonRes) {
        PAYLOADS = jsonRes;
        return;
    }
    const listRes = await loadRemoteList(listPaths);
    if (listRes) {
        PAYLOADS = listRes;
        return;
    }
    PAYLOADS = DEFAULT_PAYLOADS.slice();
}

// PS4 only
if (!navigator.userAgent.includes("PlayStation 4")) {
    document.body.innerHTML = "<h1>NOT SUPPORTED</h1>";
    throw 0;
}

const status = txt => document.getElementById("status").innerText = txt;

async function sendToGoldHEN(payload) {
    // GoldHEN internal binloader endpoint (varies by version)
    const endpoints = [
        "http://127.0.0.1:9090",      // legacy bridge (if exposed)
        "http://127.0.0.1/payload",   // modern HTTP bridge
        "http://localhost/payload"
    ];

    for (const url of endpoints) {
        try {
            await fetch(url, {
                method: "POST",
                body: payload
            });
            return true;
        } catch (e) { }
    }
    return false;
}

async function loadPayload(name) {
    status("Loading " + name);
    // Try base path first, then a fallback (handles both payloads/ and payloades/)
    let res = null;
    try {
        res = await fetch(PAYLOADS_BASE_PATH + name);
    } catch (e) {
        res = null;
    }
    if (!res || !res.ok) {
        // try the other name if we defaulted to payloads/ but directory is payloades/
        const altBase = PAYLOADS_BASE_PATH === 'payloads/' ? 'payloades/' : 'payloads/';
        try {
            res = await fetch(altBase + name);
        } catch (e) {
            res = null;
        }
    }
    if (!res || !res.ok) {
        status("Failed to fetch payload: " + name);
        return;
    }
    const buf = await res.arrayBuffer();

    status("Sending payload…");
    const ok = await sendToGoldHEN(buf);

    status(ok ? "Payload sent ✔" : "GoldHEN not detected ✖");
}

const list = document.getElementById("list");
async function init() {
    await populatePayloads();
    list.innerHTML = '';
    PAYLOADS.forEach(p => {
        const div = document.createElement("div");
        div.className = "payload";
        div.textContent = p;
        div.onclick = () => loadPayload(p);
        list.appendChild(div);
    });
}



init();
