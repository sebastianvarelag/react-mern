const moment = require('moment');
// Validación - Funcioón

const isDate = (value, { req, location, path }) =>{
  // Implementación de la validación de fecha
  if(!value){
    return false;
  }
  const date = moment(value);
  if(date.isValid()){
    return true;
  }else{
    return false;
  }
}

module.exports = {
  isDate,
}