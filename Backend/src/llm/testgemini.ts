import {Request, Response} from "express";
import {Content, GoogleGenerativeAI} from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

// GoogleGenerativeAI required config
const configuration = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || "None"
);

// Model initialization
const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({model: modelId});

const conversationContext: Content[] = [];
const currentMessages: Content[] = [];

export const promptToGemini = async (
    prompt: string,
    emptyConversationContext: boolean
): Promise<String | unknown> => {
    try {
        if (emptyConversationContext) {
            conversationContext.length = 0
        }
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
        conversationContext.push({role: "user", parts: [{text: prompt}]});
        conversationContext.push({
            role: "model",
            parts: [{text: responseText}],
        });

        return responseText;
    } catch (err) {
        console.error(err);
        return err;
    }
};
