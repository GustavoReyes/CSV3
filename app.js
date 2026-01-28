const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));

app.post('/api/obtener-datos', upload.single('archivoCsv'), (req, res) => {

    if (!req.file) return res.status(400).json({ error: 'Falta archivo' });

    console.log("📂 Leyendo archivo...");

    let listaDispositivos = [];

    fs.createReadStream(req.file.path)
        .pipe(csv({
            separator: ',',
            mapHeaders: ({ header }) => header.trim(),
            mapValues: ({ value }) => value.trim()
        }))
        .on('data', (row) => {
            listaDispositivos.push(row);
        })
        .on('end', () => {
            fs.unlinkSync(req.file.path);
            res.json(listaDispositivos);
        })
        .on('error', (err) => {
            console.error("❌ Error:", err);
            res.status(500).json({ error: 'Error procesando el archivo' });
        });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});