require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Starea LED-ului
let ledState = "off";

// Endpoint pentru ESP32 să trimită date
app.post("/esp32/data", (req, res) => {
    const { sensorValue } = req.body;
    console.log(`Received data from ESP32: ${sensorValue}`);
    res.json({ message: "Data received", receivedValue: sensorValue });
});

// Endpoint pentru a verifica starea LED-ului
app.get("/led/status", (req, res) => {
    res.json({ led: ledState });
});

// Endpoint pentru a controla LED-ul
app.post("/led", (req, res) => {
    const { state } = req.body;
    if (state === "on" || state === "off") {
        ledState = state;  // 🔥 Actualizare variabilă globală
        console.log(`LED state changed to: ${ledState}`);
        res.json({ message: `LED turned ${ledState}` });
    } else {
        res.status(400).json({ error: "Invalid LED state" });
    }
});


// Pornire server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
