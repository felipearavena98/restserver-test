const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response ) => {

    // const { q, nombre = 'No name', apikey, page = '1', limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
};

const usuariosPut = async(req  , res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true} );

    res.json(usuario)
};

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;

    const usuario = new Usuario({nombre, correo, password, rol});
    
    // Hashear la contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync( password, salt );
    // Guardar en la base de datos
    await usuario.save();

    res.status(201).json({
        usuario
    })
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    })
};

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, {new: true});

    res.json(usuario);
};


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}