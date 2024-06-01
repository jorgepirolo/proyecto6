const Client = require('../models/client')

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find()
    return res.status(200).json(clients)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const postClients = async (req, res, next) => {
  try {
    const newClient = new Client(req.body)
    const clientSaved = newClient.save()
    return res.status(201).json(clientSaved)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const updateClients = async (req, res, next) => {
  try {
    const { id } = req.params
    const newClient = new Client(req.body)
    newClient._id = id

    const clientUpdated = await Client.findByIdAndUpdate(id, newClient, {
      new: true
    })

    return res.status(200).json(clientUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const deleteClients = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientDeleted = await Client.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'Elemento eliminado',
      elemento: clientDeleted
    })
  } catch (error) {
    return res.status(400).json('error')
  }
}

module.exports = {
  getClients,
  postClients,
  updateClients,
  deleteClients
}
