const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

async function fetchPrice(symbol) {
  try {
    const url = `https://www.alphavantage.co/query`;
    const response = await axios.get(url, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol,
        apikey: API_KEY
      }
    });

    const data = response.data["Global Quote"];
    if (!data || !data["05. price"]) {
      throw new Error(`No price data for ${symbol}`);
    }

    return parseFloat(data["05. price"]);
  } catch (err) {
    console.error(`Error fetching price for ${symbol}:`, err.message);
    return null;
  }
}

module.exports = { fetchPrice };
