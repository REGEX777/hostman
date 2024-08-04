import 'dotenv/config'
// Important Imports
import express from 'express';
import ejs from 'ejs';
import multer from 'multer';
import mongoose from 'mongoose';

// Extra Imports
import colors from 'colors';

// Database Initialization

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log(`[INFORMATION]> Succesfully connected to the database.`.green)})
.catch(err=>console.log(err))


// Route Imports
import userRoute from './routes/Home.js'
import keyDetails from './routes/keyDetails.js'
import embedEditor from './routes/embedEditor.js'
import apiControl from './routes/apiControl.js'

const PORT = process.env.PORT


const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/', userRoute)
app.use('/apidetails', keyDetails)
app.use('/embedEditor', embedEditor)
app.use('/api', apiControl)

app.listen(PORT, ()=>{
    console.log(`[+] Server Running On Port ${PORT}`.green)
})
