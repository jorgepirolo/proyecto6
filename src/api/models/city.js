const mongoose = require('mongoose')

const citySchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    population: { type: Number, require: true },
    kms: { type: Number, require: true },
    imgUrl: { type: String },
    clients: [{ type: mongoose.Types.ObjectId, ref: 'clients' }]
  },
  {
    timestamps: true
  }
)

const City = mongoose.model('cities', citySchema, 'cities')

module.exports = City
