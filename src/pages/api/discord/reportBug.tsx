import { NextApiHandler } from "next"

const ReportBug: NextApiHandler = async (req, res) => {
  const { text, discord, url } = req.body

  if (text) {
    const payload = {
      content: "A new bug report submitted from the web app!",
      embeds: [
        {
          title: discord,
          description: url,
          footer: {
            text: text,
          },
        },
      ],
    }

    await fetch(process.env.DISCORD_WEBHOOK_URL_REPORT_BUG, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })

    res.status(200).json({ message: "success" })
  } else {
    res.status(404).end()
  }
}

export default ReportBug
