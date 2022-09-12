const swagger = require('swagger-autogen');

const swaggerGen = swagger();

swaggerGen('./swagger.json',
[
    './server.js',
    './routes/authRoute.js',
    './routes/categoryRoute.js',
    './routes/userRoute.js'
]);