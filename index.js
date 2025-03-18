require("dotenv").config(); // Charge les variables d'environnement
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Vérification des variables Sellsy
console.log("✅ Chargement des variables d'environnement :");
console.log("SELLSY_API_KEY:", process.env.SELLSY_API_KEY ? "OK" : "❌ MANQUANT");
console.log("SELLSY_SECRET:", process.env.SELLSY_SECRET ? "OK" : "❌ MANQUANT");
console.log("SELLSY_TOKEN:", process.env.SELLSY_TOKEN ? "OK" : "❌ MANQUANT");
console.log("SELLSY_TOKEN_SECRET:", process.env.SELLSY_TOKEN_SECRET ? "OK" : "❌ MANQUANT");

// Route Webhook Webflow → Sellsy
app.post("/webflow-to-sellsy", async (req, res) => {
    try {
        console.log("🔹 Requête reçue :", req.body);

        if (!req.body.data || !req.body.data.email) {
            return res.status(400).json({ error: "Données invalides (email requis)" });
        }

        const contactData = {
            name: req.body.data.name || "Inconnu",
            email: req.body.data.email,
            phone: req.body.data.phone || "",
            company: req.body.data.company || ""
        };

        console.log("📤 Envoi des données à Sellsy :", contactData);

        // Appel API Sellsy
        const response = await axios.post("https://api.sellsy.com/v2/contacts", contactData, {
            headers: {
                "Authorization": `Bearer ${process.env.SELLSY_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        console.log("✅ Réponse Sellsy :", response.data);
        res.json({ message: "Contact ajouté avec succès", sellsyResponse: response.data });

    } catch (error) {
        console.error("❌ Erreur Sellsy :", error.response ? error.response.data : error);
        res.status(500).json({ error: "Erreur interne du serveur", details: error.response ? error.response.data : error.message });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur Webflow-to-Sellsy en écoute sur le port ${PORT}`);
});
