"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = require("express");
var client_1 = require("@prisma/client");
var dotenv_1 = require("dotenv");
var candidateRoutes_1 = require("./routes/candidateRoutes");
var positionRoutes_1 = require("./routes/positionRoutes");
var fileUploadService_1 = require("./application/services/fileUploadService");
var cors_1 = require("cors");
dotenv_1.default.config();
var prisma = new client_1.PrismaClient();
exports.app = (0, express_1.default)();
exports.default = exports.app;
// Middleware para parsear JSON. Asegúrate de que esto esté antes de tus rutas.
exports.app.use(express_1.default.json());
// Middleware para adjuntar prisma al objeto de solicitud
exports.app.use(function (req, res, next) {
    req.prisma = prisma;
    next();
});
// Middleware para permitir CORS desde http://localhost:3000
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
// Import and use candidateRoutes
exports.app.use('/candidates', candidateRoutes_1.default);
// Route for file uploads
exports.app.post('/upload', fileUploadService_1.uploadFile);
// Route to get candidates by position
exports.app.use('/position', positionRoutes_1.default);
exports.app.use(function (req, res, next) {
    console.log("".concat(new Date().toISOString(), " - ").concat(req.method, " ").concat(req.path));
    next();
});
var port = 3010;
exports.app.get('/', function (req, res) {
    res.send('Hola LTI!');
});
exports.app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500).send('Something broke!');
});
exports.app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
