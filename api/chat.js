
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "API key belum dipasang"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Kamu adalah BIBZ AI, asisten pintar yang ramah, membantu, dan menjawab dalam bahasa pengguna."
            },
            ...messages
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "AI gagal merespons"
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    return res.status(500).json({
      error: "Terjadi kesalahan server"
    });
  }
}
