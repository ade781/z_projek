import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    console.log("masuk verify token: ", { token });
    if (token == null) return res.status(401).json({ message: "Token tidak ditemukan" });
    console.log("sudah lewat 401 di verify")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            const message =
                err.name === "TokenExpiredError"
                    ? "Token kedaluwarsa"
                    : "Token tidak valid";
            return res.status(403).json({ message });
        }
        console.log("sudah lewat 403 di verify")
        req.email = decoded.email;
        next();
    })
}
