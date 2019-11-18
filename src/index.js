const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const unirest = require('unirest')

app.use(bodyParser.json())

const { PORT = 8080, RAPIDAPI_API_KEY } = process.env

app.post('/', (req, res) => {
  const { args, method = 'GET', host = '', endpoint = '' } = req.body

  const api = unirest(method, `https://${host}${endpoint}`)

  api.query(JSON.parse(args))

  api.headers({
    'x-rapidapi-host': host,
    'x-rapidapi-key': RAPIDAPI_API_KEY
  })

  api.end(({ body, error }) => {
    if (error) {
      res.status(500).json({ message: error })
      throw new Error(error)
    }

    res.json(body)
  })
})

app.get('/health', (req, res) => res.send('OK'))

app.listen(PORT, () =>
  console.log(`Listening on localhost: http://localhost:${PORT}`)
)
