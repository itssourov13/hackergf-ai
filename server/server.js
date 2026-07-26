import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


app.post("/api/chat", async (req, res) => {

  try {

    const { prompt, model } = req.body;


    const response = await client.chat.completions.create({

      model: model || "openai/gpt-4o-mini",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

    });


    const message =
      response.choices[0].message.content;


    res.json({
      message,
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });

  }

});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
