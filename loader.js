const PAYLOADS = [
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
    const res = await fetch("payloads/" + name);
    const buf = await res.arrayBuffer();

    status("Sending payload…");
    const ok = await sendToGoldHEN(buf);

    status(ok ? "Payload sent ✔" : "GoldHEN not detected ✖");
}

const list = document.getElementById("list");
PAYLOADS.forEach(p => {
    const div = document.createElement("div");
    div.className = "payload";
    div.textContent = p;
    div.onclick = () => loadPayload(p);
    list.appendChild(div);
});
