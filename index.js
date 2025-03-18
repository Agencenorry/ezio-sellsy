require('dotenv').config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/webflow-to-sellsy", async (req, res) => {
    try {
        const formData = req.body.data;

        if (!formData || !formData.email) {
            return res.status(400).json({ error: "Données invalides" });
        }

        // Construire les données pour Sellsy
        const contactData = {
            third_name: formData.name || "Inconnu",
            email: formData.email,
            phone: formData.phone || "",
            corpname: formData.company || "Non spécifié"
        };

        // Envoyer les données à l'API Sellsy
        const response = await axios.post("https://api.sellsy.com/v2/contacts", contactData, {
            headers: {
                "Authorization": `Bearer ${process.env.SELLSY_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ message: "Contact ajouté avec succès", data: response.data });
    } catch (error) {
        console.error("Erreur lors de l'envoi à Sellsy :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur Webflow-to-Sellsy en écoute sur le port ${PORT}`));
