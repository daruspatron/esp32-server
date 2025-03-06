const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());  // ✅ Asigură că Express procesează JSON-ul

// 🔹 Debugging: Afișează fiecare cerere primită
app.use((req, res, next) => {
    console.log(`🟢 [${req.method}] ${req.url}`);
    console.log("📥 Body primit:", req.body);
    console.log("🔍 Headers:", req.headers);
    next();
});

let mode = "led";  // Mod implicit
let ledState = "off";
let sensorData = { temperature: null, humidity: null };

// 🔹 Endpoint pentru obținerea modului curent
app.get("/mode", (req, res) => {
    res.json({ mode });
});

// 🔹 Endpoint pentru schimbarea modului
app.post("/mode", (req, res) => {
    console.log("🔹 Cerere primită la /mode:", req.body);
    console.log("🔍 Headers:", req.headers);

    if (!req.body || !req.body.mode) {
        console.log("❌ JSON invalid primit!");
        return res.status(400).json({ error: "Invalid mode, missing 'mode' key." });
    }

    const { mode: newMode } = req.body;
    if (newMode === "led" || newMode === "sensor") {
        mode = newMode;
        console.log(`✅ Mod schimbat la: ${mode}`);
        res.json({ message: `Mode set to ${mode}` });
    } else {
        console.log("❌ Eroare: Invalid mode primit:", newMode);
        res.status(400).json({ error: "Invalid mode" });
    }
});


// 🔹 Endpoint pentru control LED
app.post("/led", (req, res) => {
    const { state } = req.body;

    if (!state || (state !== "on" && state !== "off")) {
        console.log("❌ Eroare: Invalid LED state primit:", state);
        return res.status(400).json({ error: "Invalid LED state" });
    }

    ledState = state;
    console.log(`💡 LED set to: ${ledState}`);
    res.json({ message: `LED turned ${ledState}` });
});

// 🔹 Endpoint pentru verificarea statusului LED-ului
app.get("/led/status", (req, res) => {
    res.json({ led: ledState });
});

// 🔹 Endpoint pentru trimiterea datelor senzorului
app.post("/esp32/data", (req, res) => {
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
        console.log("❌ Eroare: Invalid sensor data primit:", req.body);
        return res.status(400).json({ error: "Invalid sensor data, missing temperature or humidity" });
    }

    sensorData = { temperature, humidity };
    console.log(`🌡️ Temp: ${temperature}°C, 💧 Humidity: ${humidity}%`);
    res.json({ message: "Data received", temperature, humidity });
});

// 🔹 Endpoint pentru obținerea ultimelor date ale senzorului
app.get("/esp32/data", (req, res) => {
    res.json(sensorData);
});

// 🔹 Pornirea serverului
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
