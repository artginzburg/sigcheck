const cors = require("cors");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
});
const fsExtra = require("fs-extra");

const app = require("express")();
const port = 6969;

const getSigns = require("./getSigns.js");

const devMode = process.env.NODE_ENV === "development";
if (devMode) {
  getSigns().then(console.log);
  return;
}

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["X-Requested-With", "content-type"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", async (req_, res) => {
  res.setHeader("Content-Type", "application/json");

  try {
    const signs = await getSigns();
    res.send(signs);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
});

app.post("/check", upload.array("toCheck", 2), async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const signs = await getSigns();
    res.send(signs);
    fsExtra.emptyDirSync("files");
  } catch (error) {
    console.error(error);
    res.status(500).send(`Server error: ${error}`);
  }
});

app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT} address!`)
);
