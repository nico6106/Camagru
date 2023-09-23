
const express = require('express')
const app = express()

app.use(logger)

console.log('bonjour')

app.get('/', (req, res) => {
	res.send('Hiii')
})

function logger(req, res, next) {
	console.log(req.originalUrl)
	next()
}

app.listen(3333)
