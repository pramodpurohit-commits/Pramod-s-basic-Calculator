
import { GoogleGenerativeAI } from "@google/genai"

export default async function handler(req: any, res: any) {
  try {
    const { prompt } = req.body

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    res.status(200).json({ answer: text })
  } catch (err) {
    res.status(500).json({ error: "AI error" })
  }
}
