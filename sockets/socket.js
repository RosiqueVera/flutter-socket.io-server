const {io} = require('../index');
const Band = require('../models/band');

const Bands  = require("../models/bands");
const bands = new Bands();
console.log('Init Server');

bands.addBand(new Band('Panda'));
bands.addBand(new Band('Allison'));
bands.addBand(new Band('Bullet For My Valentine'));
bands.addBand(new Band('Fit For Rivals'));
bands.addBand(new Band('Skillet'));

//!Sockets
//?Mensajes
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands',bands.getBands());

    client.on('disconnect', () => {console.log('Cliente desconectado')});

    client.on('mensaje',(payload)=>{
        console.log('mensaje!!', payload);

        io.emit('mensaje',{admin: 'Nuevo mensaje'});
    });
    client.on('emitir-mensaje',(payload) => {
        console.log('Mensaje recibido: ',payload);
        //io.emit('emitirMensaje',payload); //! Emite a todos
        client.broadcast.emit('emitir-mensaje',payload); //! Emite a todos menos al cliente
    });
    client.on('add-vote',(payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
        
    });

    client.on('add-band',(payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band',(payload) =>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });
  });