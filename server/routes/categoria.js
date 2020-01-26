const express = require("express");

let {verificarToken, verificaAdmin_Role} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// ===========================================
// MOSTRAR TODAS LAS CATEGORIAS
// ===========================================
app.get("/categoria", verificarToken,(req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        return res.status(200).json({
            ok: true,
            categorias
        });
    });
});

// ===========================================
// MOSTRAR UNA CATEGORIA POR ID
// ===========================================
app.get("/categoria/:id", verificarToken,(req, res) => {
    let id = req.params.id;
  Categoria.findById(id, (err, categoriaBD) => {
    if(err){
        return res.status(500).json({
            ok: false,
            err
        })
    }
    if(!categoriaBD){
        return res.send(400).json({
            ok: false,
            err:{
                message: 'El id no existe'
            }
        });
    }
    return res.status(200).json({
        ok: true,
        categoria: categoriaBD
    });
  })
});

// ===========================================
// CREAR UNA CATEGORIA
// ===========================================
app.post("/categoria", verificarToken, (req, res) => {
     let body = req.body;
     let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
     });
     categoria.save((err, categoriaBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaBD){
            return res.status(200).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            categoria: categoriaBD
        });
     });
});

// ===========================================
// ACTUALIZAR UNA CATEGORIA
// ===========================================
app.put("/categoria/:id", verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let desCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, {new: true, runValidators: true}, (err, categoriaBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaBD){
            return res.status(200).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

// ===========================================
// BORRAR UNA CATEGORIA
// ===========================================
app.delete("/categoria/:id", [verificarToken, verificaAdmin_Role], (req, res) => {
    // SOLO UN ADMINISTRADOR PODRA BORRAR UNA CATEGORIA
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if(err){
            return res.send(500).jsonp({
                ok: false,
                err
            });
        }
        if(!categoriaBD){
            return res.send(400).json({
                ok: false,
                err:{
                    message: 'El id no existe'
                }
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Categoria Borrada'
        });
    });
});



module.exports = app;
