const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos = async(req, res = response) =>{
  
  const eventos = await Evento.find()
                              .populate('user', 'name');

  res.json({
    ok: true,
    eventos
  })
}

const createEvent = async(req, res = response) =>{

  const evento = new Evento(req.body);

  try{
    evento.user = req.uid;

    const eventSaved = await evento.save();

    res.json({
      ok: true,
      evento: eventSaved,
      msg: 'Event created'
    })
  }catch(err){
    console.log(err);

    res.status(500).json({
      ok: false,
      msg: 'Contact an administrator'
    })
  }
}

const updateEvent = async(req, res = response) =>{

  const eventoId = req.params.id;
  const uid = req.uid;

  try{
    const evento = await Evento.findById(eventoId);

    if(!evento){
      return res.status(404).json({
        ok: false,
        msg: 'Event not found by ID'
      })
    }
    
    if(evento.user.toString() !== uid){
      return res.status(401).json({
        ok: false,
        msg: 'Unauthorized, you are not the owner of this event'
      })
    }

    const newEvent = {
      ...req.body,
      user: uid
    }

    const eventUpdated = await Evento.findByIdAndUpdate(eventoId, newEvent, {new: true});

    res.json({
      ok: true,
      evento: eventUpdated,
      msg: 'Event updated'
    })  
  
  }catch(err){
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: 'Contact an administrator'
    });
  }

  res.json({
    ok: true,
    eventoId
  })
}

const deleteEvent = async(req, res = response) =>{
  const eventoId = req.params.id;
  const uid = req.uid;

  try{

    const evento = await Evento.findById(eventoId);
    if(!evento){
      return res.status(404).json({
        ok: false,
        msg: 'Event not found by ID'
      })
    }
    
    if(evento.user.toString() !== uid){
      return res.status(401).json({
        ok: false,
        msg: 'Unauthorized, you are not the owner of this event'
      })
    }

    await Evento.findByIdAndDelete(eventoId)

    res.status(200).json({
      ok: true,
      msg: 'Event deleted'
    });

  }catch(err){
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: 'Contact an administrator'
    });
  }

  res.json({
    ok: true,
    msg: 'deleteEvent'
  })
}


module.exports = {
  getEventos,
  createEvent,
  updateEvent,
  deleteEvent
}