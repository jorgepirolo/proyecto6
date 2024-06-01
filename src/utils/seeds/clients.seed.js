const mongoose = require('mongoose')
const clients = require('../../data/clients')
const Client = require('../../api/models/client')

const lanzarSemilla = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgepirolo:fg3a9rqS5viloKUN@cluster0.yaxa4od.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    await Client.collection.drop()
    console.log('Clientes eliminados')

    await Client.insertMany(clients)
    console.log('Clientes introducidos')

    await mongoose.disconnect()
    console.log('Desconectamos de la BBDD')
  } catch (error) {
    console.log('Error al plantar la semilla 🪴❌')
  }
}

lanzarSemilla()
