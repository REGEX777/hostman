import 'dotenv/config'
// Important Imports
import express from 'express';
import ejs from 'ejs';

// Extra Imports
import colors from 'colors';

// Route Imports
import userRoute from './routes/Home.js'
import keyDetails from './routes/keyDetails.js'


const PORT = process.env.PORT


const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


app.use('/', userRoute)
app.use('/apidetails', keyDetails)

app.listen(PORT, ()=>{
    console.log(`[+] Server Running On Port ${PORT}`.green)
})
