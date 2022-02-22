const Express = require('express')
const Mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
//connect data
Mongoose.connect('mongodb://localhost:27017')
// create schema
const PersonModel = Mongoose.model('person', {
  // @ts-ignore
  username: String,
  password: String,
  fullname: String,
})
const BodyParser = require('body-parser')
const { request } = require('express')
var app = Express()
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
// Define REST API
app.post('/user', async (request, response) => {
  try {
    var person = new PersonModel(request.query)
    var result = await person.save()
    response.send(result)
  } catch (error) {
    response.status(500).send(error)
  }
})
//add new data
app.get('/user', async (request, response) => {
  
  // @ts-ignore
  const result = request.query
  if (result.username != null || request.password != null) {
    console.log('kiểm tra')
    try {
      var results = await PersonModel.find({
        username: result.username,
        password: result.password,
      }).exec()
      response.send(results)
    } catch (error) {
      response.status(500).send(error)
    }
  } else {
    if (result.page != undefined || result.limit != undefined) { 
      try {
        PersonModel.find({}, (err, users) => {
          if (err) {
            response.send(err)
          } else {
            response.send(users)
          }
          // @ts-ignore
        })
          .skip(page * 10)
          .limit(limit)
      } catch (error) {}
    } else {
      try {
        var results = await PersonModel.find({}).exec()
        response.send(results)
      } catch (error) {
        response.status(500).send(error)
      }
    }
  }
})
//search data by id
app.get('/user/:id', async (request, response) => { 
  try {
    var person = await PersonModel.findById(request.params.id).exec()
    response.send(person)
  } catch (error) {
    response.status(500).send(error)
  }
})
// update
app.put('/user/:id', async (request, response) => {
  console.log('====================================');
  console.log(request);
  console.log('====================================');
  try {
    var person = await PersonModel.findById(request.params.id).exec()
    person.set(request.body)
    var result = await person.save()
    response.send(result)
  } catch (error) {
    response.status(500).send(error)
  }
})
app.delete('/user/:id', async (request, response) => {
  try {
    var result = await PersonModel.deleteOne({ _id: request.params.id }).exec()
    response.send(result)
  } catch (error) {
    response.status(500).send(error)
  }
})
app.post('/user/:username&:password', async (request, response) => {
  console.log("đã xuống"); 
})
      
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));     
app.listen(3000, () => {
  console.log('Listening at :3000...')
})
