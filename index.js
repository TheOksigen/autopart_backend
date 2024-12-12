const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const bulkProductRoutes = require('./src/routes/bulkProduct.r.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api', routes);
app.use('/api/products', bulkProductRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});
