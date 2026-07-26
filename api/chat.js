export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { prompt, model } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      }
    );


    const data = await response.json();


    res.json({
      message:
        data.choices?.[0]?.message?.content ||
        "No response"
    });


  } catch(error) {

    console.error(error);

    res.status(500).json({
      error: "AI request failed"
    });

  }
}
