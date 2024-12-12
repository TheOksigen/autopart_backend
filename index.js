const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const bulkProductRoutes = require('./src/routes/bulkProduct.r.js');
const { apiReference } = require('@scalar/express-api-reference');
const path = require('path');
const swaggerDefinition = require("./swagger.js")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Scalar API Reference middleware
app.use('/docs', apiReference({
  spec: {
    content: swaggerDefinition
  }
}));

app.use('/api', routes);
app.use('/api/products', bulkProductRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Scalar Docs: http://localhost:${PORT}/docs`);  
});
