# Proyecto 6 API REST
### _Rock The Code_
#### Jorge Pirolo

## Objetivos
> - Servidor con express
> - Conexión a una base de datos de Mongo Atlas mediante mongoose
> - Creación de dos modelos
> - Una semilla que suba datos a una de las colecciones
> - Una relación entre colecciones, un array de datos relacionados
> - CRUD completo de ambas colecciones
> - README.md con la documentación del proyecto, indicando los endpoints y que hace cada uno
> - Al actualizar una colección que tenga un array de datos relacionados, no queremos que estos datos se borren
> - Evitaremos duplicados en el array relacionado

## Servidor
Servidor levantado con express en la ruta:
```
http://localhost:3000
```
## BBDD
Conectado a BBDD usando la libreria mongoose. Puedes encontrar el enlace a Mongo Atlas en la variable `DB_URL` guardada en el `.env`
## Modelos
#### city
```javascript
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
```

#### client
En la clave `sector` se establece un array de opciones posibles para escoger
```javascript
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
```

## Semillas

En la carpeta `seeds` dentro de `utils` encontraras dos semillas de datos para cada modelo

## Relación entre modelos
El modelo city esta relacinado en su `key` `clients` con el modelo client

## CRUD de city

#### GET
Consulta todas las ciudades en la BBDD y _"expande"_ la información de su clave `clients`
```javascript
const getCities = async (req, res, next) => {
  try {
    const cities = await City.find().populate('clients')
    return res.status(200).json(cities)
  } catch (error) {
    return res.status(400).json('error')
  }
}
```

#### POST
Publica una nueva ciudad obteniendo los datos mediante el `body` de la `req`
```javascript
const postCity = async (req, res, next) => {
  try {
    const newCity = new City(req.body)
    const citySaved = newCity.save()
    return res.status(201).json(citySaved)
  } catch (error) {
    return res.status(400).json('error')
  }
}
```


#### PUT (Update)
Actualiza una ciudad (recogida mediante el `id` por los `params`)
> Comprobaciones
> - Al actualizar la clave relacionada `clients` añade a los clientes existentes los recogidos en el `body` (no elimina los que ya existían)
> - Crea un array de clientes únicos para evitar que haya duplicados
> - Si el user desea borrar los clientes actuales debe ingresar en el `body ` un array vacío

```javascript
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
```

#### DELETE
Elimina una ciudad recogida por el `id` en los `params`
```javascript
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
```

## CRUD de client

### GET
Consulta todos los clientes en la BBDD
```javascript
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find()
    return res.status(200).json(clients)
  } catch (error) {
    return res.status(400).json('error')
  }
}
```
### POST
Publica un nuevo cliente obteniendo los datos mediante el `body` de la `req`
```javascript
const postClients = async (req, res, next) => {
  try {
    const newClient = new Client(req.body)
    const clientSaved = newClient.save()
    return res.status(201).json(clientSaved)
  } catch (error) {
    return res.status(400).json('error')
  }
}
```

### PUT (Update)
Actualiza un cliente (recogido mediante el `id` por los `params`)
> Los datos actualizados son recogidos en el `body` de la `req`
```javascript
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
```
### DELETE
Elimina un cliente recogido por el `id` en los `params`
```javascript
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
```

## ROUTES
Utilizamos mediante express las siguientes rutas para clients y cities respectivamente
```javascript
app.use('/api/v1/clients', clientsRouter)  // en el index.js

const clientsRouter = require('express').Router()

clientsRouter.get('/', getClients)
clientsRouter.post('/', postClients)
clientsRouter.put('/:id', updateClients)
clientsRouter.delete('/:id', deleteClients)

```
```javascript
app.use('/api/v1/cities', citiesRouter)  // en el index.js

const citiesRouter = require('express').Router()

citiesRouter.get('/', getCities)
citiesRouter.post('/', postCity)
citiesRouter.put('/:id', updateCity)
citiesRouter.delete('/:id', deleteCity)
```




