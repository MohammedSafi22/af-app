const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

dotenv.config({path:'config.env'});
const globalError = require('./middlewares/errorMiddleware');
const ApiError = require('./utils/apiError');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');


// connect with db
dbConnection();

const app = express();

app.use(express.json());
app.use(express.static('./public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'));
}

// routes
app.use('/api/v1/categories',categoryRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/auth',authRoute);


app.all('*',(req,res,next)=>{
    next(new ApiError(`cant find this route:${req.originalUrl}`,400))
})

app.use(globalError);


const PORT = process.env.PORT || 3000;
const server =  app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
});

process.once('unhandledRejection',(err)=>{
    console.error(`unhandledRejection Errors:${err.name}|${err.message}`);
    server.close(()=>{
        console.error('Shut Down')
        process.exit(1);
    })   
})