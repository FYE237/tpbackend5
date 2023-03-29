const swaggerAutogen = require('swagger-autogen')()

const outputFile = 'swagger_output.json'
const endpointsFiles = ['src/routes/user.js', 'src/routes/router.js','src/routes/tags.js','src/routes/token.js']

swaggerAutogen(outputFile, endpointsFiles)
