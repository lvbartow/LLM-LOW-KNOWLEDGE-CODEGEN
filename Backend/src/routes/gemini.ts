import { Request, Response } from "express";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

// GoogleGenerativeAI required config
const configuration = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "None"
);

// Model initialization
const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({ model: modelId });

//These arrays are to maintain the history of the conversation
const conversationContext: Content[] = [];
const currentMessages: Content[] = [];

// Controller function to handle chat conversation
export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // Restore the previous context
    for (const message of conversationContext) {
      currentMessages.push(message);
    }

    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Store the current conversation
    conversationContext.push({ role: "user", parts: [{ text: prompt }] });
    conversationContext.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
