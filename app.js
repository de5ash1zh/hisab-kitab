const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs").promises;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const files = await fs.readdir("./hisaab");
    res.render("index", { files: files });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/edit/:filename", async (req, res) => {
  try {
    const filedata = await fs.readFile(
      `./hisaab/${req.params.filename}`,
      "utf-8"
    );
    res.render("edit", { filedata, filename: req.params.filename });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/createhisaab", async (req, res) => {
  const currentDate = new Date();
  const date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;

  try {
    let counter = 1;
    let filePath = `./hisaab/${date}.txt`;

    // Check if the file already exists and increment the counter
    while (await fileExists(filePath)) {
      filePath = `./hisaab/${date}(${counter}).txt`;
      counter++;
    }

    await fs.writeFile(filePath, req.body.content);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/hisaab/:filename", async (req, res) => {
  try {
    const filedata = await fs.readFile(
      `./hisaab/${req.params.filename}`,
      "utf-8"
    );
    res.render("hisaab", { filedata, filename: req.params.filename });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/delete/:filename", async (req, res) => {
  try {
    const filedata = await fs.unlink(`./hisaab/${req.params.filename}`);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/update", async (req, res) => {
  const { filename, content } = req.body;
  try {
    await fs.writeFile(`./hisaab/${filename}`, content);
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Helper function to check if a file exists
async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
