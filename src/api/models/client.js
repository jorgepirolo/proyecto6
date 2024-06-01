const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    sector: {
      type: String,
      enum: [
        'logistics',
        'pharma',
        'service center',
        'manufacturing',
        'automotive',
        'chemicals',
        'food',
        'retail'
      ],
      require: true
    },
    starProductimgUrl: { type: String }
  },
  {
    timestamps: true
  }
)

const Client = mongoose.model('clients', clientSchema, 'clients')

module.exports = Client
