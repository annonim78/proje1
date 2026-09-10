const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    kullaniciAdi: { type: String, required: true, unique: true },
    eposta: { type: String, required: true, unique: true },
    sifre: { type: String, required: true },
    tarih: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);