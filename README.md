# PS4 Payload Loader (ps4binrt)

A minimal web-based payload loader for PlayStation 4 that sends .bin payloads to a local GoldHEN bridge using HTTP POST. The interface is lightweight and designed to be served from any static HTTP server and opened in the PS4's built-in browser.

---

## ⚙️ Overview

This project provides a very small UI (`index.html`) and a single JavaScript loader (`loader.js`) that: 

- Lists available payloads defined in `loader.js` (`PAYLOADS`) and in the `payloades` folder (binary files provided in the repository),
- Loads the selected `.bin` file using fetch,
- Attempts to post it to GoldHEN's local bridge endpoints used in various versions.

Note: The code checks that it's being opened in a PlayStation 4 browser (via `navigator.userAgent`) before enabling the UI.

---

## 🔧 How it works

- The list of payload filenames is hard-coded in `loader.js` in the `PAYLOADS` array (see `loader.js` to add/remove entries).
- When a listed payload is clicked, the loader fetches the payload file over HTTP and then attempts to POST it to one of the GoldHEN endpoints:
  - `http://127.0.0.1:9090`
  - `http://127.0.0.1/payload`
  - `http://localhost/payload`

If the POST succeeds, the UI shows success; otherwise it indicates that GoldHEN wasn't detected.

---

## Quick Start — Serve and load from a host machine

1. (Recommended) Fix the payloads folder name (see Note)

   The repo contains a folder named `payloades` (typo). `loader.js` expects a folder called `payloads/` (plural) for fetching binaries. Rename the folder to avoid a browser 404:

   ```bash
   cd /Users/rajabdev/Documents/Developments/ps4binrt
   git mv payloades payloads
   git commit -m "Rename payloades → payloads for loader compatibility"
   ```

2. Serve the repo via a static HTTP server accessible from your PS4. For example using Python:

   ```bash
   # from the repo root
   python3 -m http.server 8000
   ```

   Or using `npx serve`:

   ```bash
   npx serve -p 8000
   ```

3. Open the PS4's browser and visit `http://<host-ip>:8000/` and select a payload. The loader will attempt to send the payload to GoldHEN running on the console.

---

## Usage

- Make sure your PS4 is running GoldHEN and is on the same local network as the host serving the payload files.
- Open `index.html` on the PS4 browser.
- Click one of the payload entries in the list. The UI will display status messages while fetching and sending.

---

## Adding or updating payloads

There are two places to update when adding a new payload:

1. Add or copy the `.bin` payload to the `payloads/` folder.
2. Update `loader.js` and add the file name into the `PAYLOADS` array so the loader will show the new payload file in the UI.

(Advanced) If you'd like to avoid manually editing `loader.js`, you can extend the code to fetch `payloads/list.txt` and populate the list at runtime instead of hardcoding filenames.

---

## Troubleshooting

- If the UI shows `NOT SUPPORTED`, the PS4's user agent check is failing; ensure you are opening the page from a PS4 browser.
- If you see `GoldHEN not detected ✖`, GoldHEN may not be running or the bridge endpoint is not available. Confirm GoldHEN is installed and that it exposes a payload bridge at one of the endpoints in `loader.js`.
- If fetching payloads returns 404, ensure you placed payloads into `payloads/` folder and it's correctly served.
- If you keep the `payloades/` folder name, either rename it to `payloads/` or change `loader.js` to fetch from `payloades/`.

---

## Security & Legal Notice ⚠️

- Only use this project with hardware you own and in accordance with any applicable laws or Terms of Service. Be aware that jailbreaking, modding, or otherwise modifying game consoles may carry legal or warranty risks.
- This repository is provided as-is. Use at your own risk.

---

## Contributing

Contributions are welcome. If you want to fix the `payloades` → `payloads` mismatch permanently and/or add automatic payload detection from `list.txt`, open a PR with:
- A rename of the `payloades` directory to `payloads`,
- Or a small enhancement to `loader.js` to dynamically read `payloades/list.txt` (or `payloads/list.txt`) and populate `PAYLOADS`.

---

## Acknowledgements

Thanks to the PS4 modding/homebrew community and to the authors of GoldHEN and the payloads in this repo.

---

## License

No license file included. If you want a specific license added, please add a `LICENSE` or ask to have one added (MIT, GPL, etc.).
