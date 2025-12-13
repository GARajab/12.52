const ua = navigator.userAgent;
document.getElementById("platform").textContent = "PlayStation 4";
const fw = ua.match(/PlayStation 4\/([0-9.]+)/);
document.getElementById("fw").textContent = fw ? fw[1] : "Unknown";
