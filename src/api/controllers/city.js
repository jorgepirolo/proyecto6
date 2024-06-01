const City = require('../models/city')

const getCities = async (req, res, next) => {
  try {
    const cities = await City.find().populate('clients')
    return res.status(200).json(cities)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const postCity = async (req, res, next) => {
  try {
    const newCity = new City(req.body)
    const citySaved = newCity.save()
    return res.status(201).json(citySaved)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const updateCity = async (req, res, next) => {
  try {
    const { id } = req.params
    const oldCity = await City.findById(id).populate('clients')

    const uniqueClients = []

    for (const client of oldCity.clients) {
      const clientString = client._id.toString()
      uniqueClients.push(clientString)
    }

    for (const client of req.body.clients) {
      if (uniqueClients.includes(client)) {
        console.log(`El id ${client} ya está incluido como cliente`)
      } else {
        uniqueClients.unshift(client)
      }
    }

    let newUnique = [...new Set(uniqueClients)]

    if (req.body.clients.length === 0) {
      newUnique = []
    }

    console.log(newUnique)

    const newCity = new City({ ...req.body, clients: newUnique })
    newCity._id = id

    const cityUpdated = await City.findByIdAndUpdate(id, newCity, {
      new: true
    }).populate('clients')

    return res.status(200).json(cityUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params
    const cityDeleted = await City.findByIdAndDelete(id)
    return res.status(200).json({
      message: 'Elemento eliminado',
      elemento: cityDeleted
    })
  } catch (error) {
    return res.status(400).json('error')
  }
}

module.exports = {
  getCities,
  postCity,
  updateCity,
  deleteCity
}
