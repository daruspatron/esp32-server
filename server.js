const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());  // 🔹 Permite procesarea datelor JSON

let mode = "led";  // Mod implicit: control LED

// 🔹 Endpoint pentru obținerea modului curent
app.get("/mode", (req, res) => {
    res.json({ mode });
});

// 🔹 Endpoint pentru schimbarea modului
app.post("/mode", (req, res) => {
    const { mode: newMode } = req.body;
    if (newMode === "led" || newMode === "sensor") {
        mode = newMode;
        console.log(`🔄 Mod schimbat: ${mode}`);
        res.json({ message: `Mode set to ${mode}` });
    } else {
        res.status(400).json({ error: "Invalid mode" });
    }
});

// 🔹 Endpoint pentru control LED (exemplu)
let ledState = "off";
app.post("/led", (req, res) => {
    const { state } = req.body;
    if (state === "on" || state === "off") {
        ledState = state;
        console.log(`💡 LED set to: ${ledState}`);
        res.json({ message: `LED turned ${ledState}` });
    } else {
        res.status(400).json({ error: "Invalid LED state" });
    }
});

// 🔹 Endpoint pentru verificarea statusului LED-ului
app.get("/led/status", (req, res) => {
    res.json({ led: ledState });
});

// 🔹 Endpoint pentru trimiterea datelor senzorului
let sensorData = { temperature: null, humidity: null };
app.post("/esp32/data", (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature !== undefined && humidity !== undefined) {
        sensorData = { temperature, humidity };
        console.log(`🌡️ Temp: ${temperature}°C, 💧 Humidity: ${humidity}%`);
        res.json({ message: "Data received", temperature, humidity });
    } else {
        res.status(400).json({ error: "Invalid sensor data" });
    }
});

// 🔹 Endpoint pentru obținerea ultimelor date ale senzorului
app.get("/esp32/data", (req, res) => {
    res.json(sensorData);
});

// 🔹 Pornirea serverului
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
