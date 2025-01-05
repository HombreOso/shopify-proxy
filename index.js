require('dotenv').config();
const express = require('express');
const axios = require('axios');

const fetch = (url, init) => import('node-fetch').then(module => module.default(url, init));const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const url = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

// Middleware
const CORS = require('cors');


// Middleware
app.use(express.json()); // To parse JSON bodies 

// Allow requests from your Shopify store's domain
// CORS Configuration
app.use(CORS({
  //origin: 'https://test-wishlist-tentech.myshopify.com', // Exact Shopify store URL
  origin: `https://${process.env.SHOPIFY_STORE_URL}`,
  methods: ['GET', 'POST', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Accept','Content-Type', 'Authorization', 'X-Shopify-Access-Token', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods'], // Specify allowed headers
  credentials: true, // Allow cookies and other credentials
}));
// Optionally, enable CORS for your frontend domain
// app.use(cors({ origin: 'https://yourstore.myshopify.com' }));

// Handle preflight requests
app.options('*', CORS());

app.get('/', async (req, res) => {
  res.status(200).json("GET POssible");
})

// Proxy Endpoint to Update Wishlist User IDs
app.post('/update-wishlist/:productId', async (req, res) => {
  const { productId } = req.params;

  const {query, variables} = req.body;

  console.log("query:", query)

  try {
    //const latestVersion = await fetchLatestStableVersion();
    // Make a POST request to the Shopify GraphQL Admin API
    const response = await axios.post(
      url, // Adjust the version if needed
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
          'Access-Control-Allow-Origin': `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com`,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
      }
    );

    // Send back the response from Shopify API
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors
    const errorMessage = error.response?.data || error.message || 'An error occurred';
    res.status(500).json({ error: errorMessage });
  }
});
  

// GET Endpoint to Retrieve Wishlist User IDs
app.post('/get-wishlist/:productId', async (req, res) => {
    const { productId } = req.params;

    const {query, variables} = req.body;

    console.log("query:", query)
  
    
  
    try {
        //const latestVersion = await fetchLatestStableVersion();
        // Make a POST request to the Shopify GraphQL Admin API
        const response = await axios.post(
          url, // Adjust the version if needed
          { query, variables },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
              'Access-Control-Allow-Origin': `https://${process.env.SHOPIFY_STORE_URL}.myshopify.com`,
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
            },
          
        );
    
        // Send back the response from Shopify API
        res.status(200).json(response.data);
      } catch (error) {
        // Handle errors
        const errorMessage = error.response?.data || error.message || 'An error occurred';
        res.status(500).json({ error: errorMessage });
      }
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});