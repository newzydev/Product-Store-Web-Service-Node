const express = require('express')

const connectDB = require('./Config/db')

const morgan = require('morgan')
const cors = require('cors')
const bodyParse = require('body-parser')
// const productRouters = require('./Routes/product')
// const authRouters = require('./Routes/auth')

const { readdirSync } = require('fs')
const HttpError = require('./Models/HttpError')


const app = express()

connectDB()
 
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParse.json({limit:'10mb'}))


// //Route 1
// app.get('/product',(req,res)=>{
//     res.send('Hello Endpoint')
// }) 

//Route 2
// app.use('/api',productRouters)
// app.use('/api',authRouters)

//Route 3
readdirSync('./Routes').map(
    (r)=> app.use('/api',require('./Routes/'+ r))
)

const { swaggerUi, swaggerSpec } = require('./Config/swaggerConfig');

// Swagger page
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Docs in JSON format
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/test', (req, res) => {
    res.send('Test route is working!');
  });

app.use((req, res, next)=>{
    const error = new HttpError('Could not find this route.',404)
    throw error;
})


app.use((err, req, res, next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(err.code || 500)
    res.json({message:err.message || 'An unknow error occurred!' })
})



app.listen(5000,()=>{
    console.log('Server is up and running on port 5000')
})