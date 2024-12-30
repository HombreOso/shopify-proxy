require('dotenv').config();
const express = require('express');
const fetch = (url, init) => import('node-fetch').then(module => module.default(url, init));const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// Optionally, enable CORS for your frontend domain
// app.use(cors({ origin: 'https://yourstore.myshopify.com' }));

// Proxy Endpoint to Update Wishlist User IDs
app.put('/update-wishlist/:productId', async (req, res) => {
  const { productId } = req.params;
  const { newWishlistUserIds } = req.body;

  const url = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2023-01/products/${productId}/metafields.json`;
  const metafieldData = {
    metafield: {
      namespace: 'custom',
      key: 'wishlist_user_ids',
      value: JSON.stringify(newWishlistUserIds),
      type: 'json',
    },
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify(metafieldData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).send(errorData);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating metafield:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET Endpoint to Retrieve Wishlist User IDs
app.get('/get-wishlist/:productId', async (req, res) => {
    const { productId } = req.params;
  
    const url = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/${process.env.SHOPIFY_API_VERSION}/products/${productId}/metafields.json?namespace=custom&key=wishlist_user_ids`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        return res.status(response.status).send(errorData);
      }
  
      const data = await response.json();
  
      // Extract the desired metafield value
      if (data.metafields && data.metafields.length > 0) {
        const wishlistUserIds = JSON.parse(data.metafields[0].value);
        res.status(200).json({ wishlist_user_ids: wishlistUserIds });
      } else {
        res.status(200).json({ wishlist_user_ids: [] }); // Return empty array if metafield doesn't exist
      }
    } catch (error) {
      console.error('Error retrieving metafield:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});