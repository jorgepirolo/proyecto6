const {
  getClients,
  postClients,
  updateClients,
  deleteClients
} = require('../controllers/client')

const clientsRouter = require('express').Router()

clientsRouter.get('/', getClients)
clientsRouter.post('/', postClients)
clientsRouter.put('/:id', updateClients)
clientsRouter.delete('/:id', deleteClients)

module.exports = clientsRouter
