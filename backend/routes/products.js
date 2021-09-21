const express = require('express');
const router = express.Router();
const axios = require('axios');

const accessTokenUrl = 'https://cloud.lightspeedapp.com/oauth/access_token.php';
const config = {
  "client_id": process.env.LIGHTSPEED_CLIENT_ID,
  "client_secret": process.env.LIGHTSPEED_CLIENT_SECRET,
  "refresh_token": process.env.LIGHTSPEED_REFRESH_TOKEN,
  "grant_type": "refresh_token"
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  axios.post(accessTokenUrl, config).then(({ data }) => {
    const config = {
      headers: { Authorization: `Bearer ${data.access_token}` }
    };
    axios.get("https://api.lightspeedapp.com/API/Account/262805/Item.json", config).then(({ data }) => res.json(data))
  });
});

router.get('/:itemID', function(req, res, next) {
  const { itemID } = req.params;
  axios.post(accessTokenUrl, config).then(({ data }) => {
    const config = {
      headers: { Authorization: `Bearer ${data.access_token}` }
    };
    const getInventory = axios.get(`https://api.lightspeedapp.com/API/Account/262805/InventoryCountItem.json`, config);
    const getItem = axios.get(`https://api.lightspeedapp.com/API/Account/262805/Item/${itemID}.json`, config);
    const getImage = axios.get(`https://api.lightspeedapp.com/API/Account/262805/Item/${itemID}/Image.json`, config);
    Promise.all([getInventory, getItem, getImage]).then(([inventory, item, image]) => {
      const itemDetails = item.data;
      itemDetails.imageDetails = image.data;
      itemDetails.inventory = inventory.data;
      res.json(itemDetails);
    });
  });
});

module.exports = router;
