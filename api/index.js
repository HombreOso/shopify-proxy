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
app.use(CORS({
  origin: 'https://test-wishlist-tentech.myshopify.com', // Replace with your store's URL
  methods: ['GET', 'POST'],
  credentials: true,
}));
// Optionally, enable CORS for your frontend domain
// app.use(cors({ origin: 'https://yourstore.myshopify.com' }));

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
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
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
              'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
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

// Start Server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});