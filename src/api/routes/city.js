const {
  getCities,
  postCity,
  updateCity,
  deleteCity
} = require('../controllers/city')

const citiesRouter = require('express').Router()

citiesRouter.get('/', getCities)
citiesRouter.post('/', postCity)
citiesRouter.put('/:id', updateCity)
citiesRouter.delete('/:id', deleteCity)

module.exports = citiesRouter
