const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Minji:123abc@boiler-plate.vjl9k.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    // to avoid error
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => console.log('MonjoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})