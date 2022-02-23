const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const Mongoose = require('mongoose')
const port = process.env.PORT || 3000;
// create schema
const PersonModel = Mongoose.model('person', {
    // @ts-ignore
    username: String,
    password: String,
    fullname: String,
  })
const BodyParser = require('body-parser')
const { request } = require('express') 
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
//route
app.get("/user", (req, res) => {
    res.send("Hello World");
})
//add swagger
const swaggerOptions = {
    // import swaggerDefinitions
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: 'Swagger API', 
            description: 'Swagger API for User data ',
            contact:{
                name: 'Trung',
            },
            server: {
                url: ['http://localhost:3000'], 
            }
        }, 
    },
    // ['.routes/*.js']
    apis: ['swagger.js'],

};
//route 
const swaggerDoc = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
//Routes
/**
 * @swagger
 * /user:
 *   get:
 *     description: Get all users
 *   responses:
 *     '200':
 *        description: A successful response
 */ 
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
/**
 * @swagger
 * /user/{id}:
 *    put:
 *      description: Use to return all user
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           required:
 *             - userName
 *           properties:
 *             userName:
 *               type: string
 *               description: Username of the user.
 *             firstName:
 *               type: string
 *               description: First name of the user.
 *             lastName:
 *               type: string
 *               description: Last name of the user.
 *    responses:
 *      '201':
 *        description: Successfully created user
 */
 app.put('/user/:id', async (request, response) => { 
    try {
      var person = await PersonModel.findById(request.params.id).exec()
      person.set(request.body)
      var result = await person.save()
      response.send(result)
    } catch (error) {
      response.status(500).send(error)
    }
  })
//list port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
} )
