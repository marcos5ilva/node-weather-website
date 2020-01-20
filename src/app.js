const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//Create an new instance of the application
const app = express()

const port = process.env.PORT || 3000 //Define a port constant

//Defining paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') //Defining a new view path pointing to the template folder
const partialPath = path.join(__dirname, '../templates/partials')

//Seting up handle bar template engine and views locations
app.set('view engine', 'hbs')
app.set('views', viewsPath) //Pointing to our custumized view directory
hbs.registerPartials(partialPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//Setting up default a route for a template
app.get('', (req, res) => {
	//The view name and the object to be rendered
	res.render('index', {
		title: 'Weather app',
		name: 'Marcos Silva'
	})
})

//Setting up the about route
app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Marcos'
	})
})

//Setting up the help route
app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		message: 'This is the help message',
		name: 'Marcos'
	})
})

//Setting up a route
app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'Address must to be provided'
		})
	}

	geocode(
		req.query.address,
		(error, { longitude, latitude, location } = {}) => {
			if (error) {
				return res.send({
					error
				})
			}

			forecast(longitude, latitude, (error, forecastData) => {
				if (error) {
					return res.send({
						error
					})
				}

				res.send({
					forecast: forecastData,
					location,
					address: req.query.address
				})
			})
		}
	)
})

/*app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }
  console.log(req.query.search);
  res.send({
    products: []
  });
});*/

app.get('/help/*', (req, res) => {
	res.render('error', {
		errorMessage: 'Help article not found'
	})
})

app.get('*', (req, res) => {
	res.render('error', {
		errorMessage: 'Error 404 Page not found'
	})
})

app.listen(port, () => {
	console.log('Server is up on port ' + port + '.')
})
