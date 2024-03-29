require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 4000;

const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY, timeout: 60000 });

// adding body-parser and cors
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: message }],
      model: "gpt-4-0125-preview",
    });
    res.json({ botResponse: completion.choices[0].message.content });
  } catch (err) {
    res.json("An error occurred, try again later");
  }
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
