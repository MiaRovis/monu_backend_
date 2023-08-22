import express from 'express'
import connect from './db.js'

const app = express()
const port = 3000

app.get('/', (req, res) => {

console.log(req.query)
res.send('hello u browser')
console.log("hello u konzolu")

})

// `

app.listen(port, () => console.log( `slusam na portu ${port}`))