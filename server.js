import compression from 'compression'
import express from 'express'
import serveStatic from 'serve-static'
import Stat from './class/Stat'
import bodyParser from 'body-parser'

let app = express()


// Middleware
app.use(compression())  
app.use(serveStatic('public', {'index': ['index.html']}))
app.use(bodyParser.json())

// Routes
app.post('/top100/api/getstat', (req, res) => {
  let jobStat = new Stat(req)
  let p1 = new Promise((resolve, reject) => jobStat.getLast(resolve, reject))
  p1.then(result => res.json(result)).catch(err => res.json({"error":err}))
})



app.listen(3000, () => {
  console.log("[INFO]Serveur démarré")
})
