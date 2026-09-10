const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;
require('dotenv').config();
app.use(express.json());


const mongoURI = process.env.MONGO_URI;



mongoose.connect(mongoURI)
    .then(() => console.log('Bulut Veritabanına Başarıyla Bağlanıldı! 🚀'))
    .catch(err => console.error('Veritabanı bağlantı hatası:', err));

const TeklifSema = new mongoose.Schema({
    ad: String,
    eposta: String,
    proje: String,
    tarih: { type: Date, default: Date.now }
});

const Teklif = mongoose.model('Teklif', TeklifSema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', async (req, res) => {
    try {
        const yeniTeklif = new Teklif({
            ad: req.body.ad,
            eposta: req.body.eposta,
            proje: req.body.proje
        });

        await yeniTeklif.save();
        res.status(200).json({ mesaj: 'Basarili' });
    } catch (hata) {
        res.status(500).json({ hata: 'Veritabanina kaydetme hatasi' });
    }
});

app.listen(port, () => {
    console.log(`Express Sunucusu Aktif! Adres: http://localhost:${port}`);
});
