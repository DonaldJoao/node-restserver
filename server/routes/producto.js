const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// ====================================
// OBTENER TODOS LOS PRODUCTOS
// ====================================
app.get('/producto', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                productos
            });
        });
});

// ====================================
// OBTENER UN PRODUCTO POR ID
// ====================================
app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoBD) {
                return res.send(400).json({
                    ok: false,
                    err: {
                        message: 'Ningun producto existe con el id espesificado'
                    }
                });
            }
            return res.status(200).json({
                ok: true,
                producto: productoBD
            });
        });
});

// ====================================
// BUSCAR PRODUCTOS
// ====================================
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                productos
            });
        });
});

// ====================================
// CREAR UN NUEVO PRODUTO
// ====================================
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        return res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

// ====================================
// ACTUALIZAR PRODUCTO
// ====================================
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

// ====================================
// BORRAR UN PRODUCTO
// ====================================
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        productoBD.disponible = false;

        productoBD.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            });
        });
    });
});

module.exports = app;