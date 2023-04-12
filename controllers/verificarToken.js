const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if(!token){
        return res.status(401).json({
            auth: false,
            mensaje: 'no tienes token'
        })
    }

    const decoded = jwt.verify(token, process.env.secret);

    req.userId = decoded.id;
    req.userRole = decoded.role
    next();
}

module.exports = verificarToken