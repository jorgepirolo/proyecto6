const mongoose = require('mongoose')
const City = require('../../api/models/city')
const cities = require('../../data/cities')

const lanzarSemilla = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgepirolo:fg3a9rqS5viloKUN@cluster0.yaxa4od.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    await City.collection.drop()
    console.log('Ciudades eliminadas')

    await City.insertMany(cities)
    console.log('Ciudades introducidas')

    await mongoose.disconnect()
    console.log('Desconectamos de la BBDD')
  } catch (error) {
    console.log('Error al plantar la semilla 🪴❌')
  }
}

lanzarSemilla()
