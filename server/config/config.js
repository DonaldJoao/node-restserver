// ==========================================
// Puerto
// ==========================================

process.env.PORT = process.env.PORT || 9000;

// ==========================================
// Entorno
// ==========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================================
// Vencimiento del token
// ==========================================
process.env.CADUCIDAD_TOKEN = "48h";

// ==========================================
// SEED de autenticacion
// ==========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==========================================
// Base de Datos
// ==========================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/randm';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = "mongodb+srv://almuerzimaster:1479515d@almuerzidb.klj6z.mongodb.net/randm?retryWrites=true&w=majority";
// process.env.URLDB = urlDB;

// ==========================================
// Google Client ID
// ==========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || "815822739209-72uo960pn6l8cuopqc4jmtp2m4g07bv6.apps.googleusercontent.com";
