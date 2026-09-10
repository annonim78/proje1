const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');
const tokenKontrol = require('./authMiddleware');
app.use(express.json());
app.use(express.static(__dirname));
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Bulut Veritabanına Başarıyla Bağlanıldı! 🚀'))
    .catch(err => console.error('Veritabanı bağlantı hatası:', err));

const TeklifSema = new mongoose.Schema({
    ad: String,
    eposta: String,
    proje: String,
    kullaniciId: String,
    tarih: { type: Date, default: Date.now }
});

const Teklif = mongoose.model('Teklif', TeklifSema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    try {if (!req.body.kullaniciAdi || !req.body.eposta || !req.body.sifre) {
    return res.status(400).json({ hata: 'Tüm alanları doldurmalısınız' });
}
if (req.body.sifre.length < 6) {
    return res.status(400).json({ hata: 'Şifre en az 6 karakter olmalı' });
}
        const varOlanKullanici = await User.findOne({ eposta: req.body.eposta });
        if (varOlanKullanici) {
            return res.status(400).json({ hata: 'Bu eposta zaten kayıtlı' });
        }

        const hashliSifre = await bcrypt.hash(req.body.sifre, 10);

        const yeniKullanici = new User({
            kullaniciAdi: req.body.kullaniciAdi,
            eposta: req.body.eposta,
            sifre: hashliSifre
        });

        await yeniKullanici.save();
        res.status(201).json({ mesaj: 'Kayıt başarılı' });
    } catch (hata) {
        res.status(500).json({ hata: 'Kayıt sırasında hata oluştu' });
    }
});

app.post('/login', async (req, res) => {
    try {if (!req.body.eposta || !req.body.sifre) {
    return res.status(400).json({ hata: 'E-posta ve şifre gerekli' });
}
        const kullanici = await User.findOne({ eposta: req.body.eposta });
        if (!kullanici) {
            return res.status(400).json({ hata: 'Eposta veya şifre hatalı' });
        }

        const sifreDogruMu = await bcrypt.compare(req.body.sifre, kullanici.sifre);
        if (!sifreDogruMu) {
            return res.status(400).json({ hata: 'Eposta veya şifre hatalı' });
        }

        const token = jwt.sign(
            { id: kullanici._id, eposta: kullanici.eposta },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ mesaj: 'Giriş başarılı', token: token });
    } catch (hata) {
        res.status(500).json({ hata: 'Giriş sırasında hata oluştu' });
    }
});

app.post('/', tokenKontrol, async (req, res) => {
    try {if (!req.body.ad || !req.body.eposta || !req.body.proje) {
    return res.status(400).json({ hata: 'Tüm alanları doldurmalısınız' });
}
        const yeniTeklif = new Teklif({
            ad: req.body.ad,
            eposta: req.body.eposta,
            proje: req.body.proje,
            kullaniciId: req.kullanici.id
        });

        await yeniTeklif.save();
        res.status(200).json({ mesaj: 'Basarili' });
    } catch (hata) {
        res.status(500).json({ hata: 'Veritabanina kaydetme hatasi' });
    }
});

app.get('/profil', tokenKontrol, (req, res) => {
    res.status(200).json({ mesaj: 'Bu korumalı bir alan, token doğrulandı!', kullanici: req.kullanici });
});

app.get('/tekliflerim', tokenKontrol, async (req, res) => {
    try {
        const teklifler = await Teklif.find({ kullaniciId: req.kullanici.id }).sort({ tarih: -1 });
        res.status(200).json(teklifler);
    } catch (hata) {
        res.status(500).json({ hata: 'Teklifler getirilemedi' });
    }
});

app.listen(port, () => {
    console.log(`Express Sunucusu Aktif! Adres: http://localhost:${port}`);
});