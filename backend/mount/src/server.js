
const express = require('express')
const app = express()

app.use(logger)

app.get('/', (req, res) => {
	res.send('Hiii')
})

function logger(req, res, next) {
	console.log(req.originalUrl)
	next()
}

app.listen(3000)
