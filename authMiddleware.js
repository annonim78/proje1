const jwt = require('jsonwebtoken');

function tokenKontrol(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ hata: 'Token bulunamadı, giriş yapmalısınız' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ hata: 'Token geçersiz veya süresi dolmuş' });
        }
        req.kullanici = decoded;
        next();
    });
}

module.exports = tokenKontrol;