import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Serve static files from /public folder (useful when running Node locally, optional on Vercel).
app.use(express.static('public'))
// Define index.html as the root explicitly (useful on Vercel, optional when running Node locally).
app.get('/', (req, res) => { res.redirect('/index.html') })

app.get("/api/currencies", async (req, res) => {
  const r = await fetch(`https://api.currencyapi.com/v3/currencies?apikey=${process.env.API_KEY}`);
  res.json(await r.json());
});

app.get("/api/latest", async (req, res) => {
  const r = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${process.env.API_KEY}`);
  res.json(await r.json());
});


const port = 3000
// app.listen(...): starts the web server and prints a message when it's ready.
// You can then open the URL in your browser to use the app locally.
app.listen(port, () => {
    console.log(`Express is live at http://localhost:${port}`)
})
