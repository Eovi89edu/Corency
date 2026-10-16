dotenv.config();

const app = express();
// Here we use public instead on ".", cuz we want node to serve stuff from "public" folder
app.use(express.static("public"));   // serves your HTML/JS

app.get("/api/currencies", async (req, res) => {
  const r = await fetch(`https://api.currencyapi.com/v3/currencies?apikey=${process.env.API_KEY}`);
  res.json(await r.json());
});

app.get("/api/latest", async (req, res) => {
  const r = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${process.env.API_KEY}`);
  res.json(await r.json());
});

app.listen(3000, () => console.log("http://localhost:3000"));
