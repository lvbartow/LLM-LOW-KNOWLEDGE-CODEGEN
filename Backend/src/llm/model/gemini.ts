import * as dotenv from "dotenv";
import {ChatSession, GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {LlmBase} from "~/llm/model/llmBase";
import {join_format_instructions, joinBaselineCoTTemplateFun} from "~/llm/prompts/join";
import {select_format_instructions, selectBaselineCoTTemplateFun, selectFewShotCoTTemplate} from "~/llm/prompts/select";
import {where_format_instructions, whereBaselineCoTTemplateFun} from "~/llm/prompts/where";
import {readFileSync} from "fs";
import {resolve} from "path";

function loadMetaSample(metaPath: string): string {
    const path : string = resolve(__dirname, metaPath)
    try {
        const data = readFileSync(path, 'utf-8');
        return data;
    } catch (error) {
        console.error("Error reading the file:", error);
        return "";
    }
}

export class Gemini extends LlmBase {

    concreteModel: GenerativeModel;
    temperature: number; //Avec Gemini la temp est à passer dans la requte et pas au moment de la configuration du model

    constructor() {
        super();
    }

    init(temp: number): boolean {
        dotenv.config();

        console.log("Init Gemini");

        // GoogleGenerativeAI required config
        const configuration = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY || "None"
        );

        // Erreur API key
        if (configuration.apiKey === "None") {
            return false;
        }

        // Model initialization
        const modelId = "gemini-pro";
        const model = configuration.getGenerativeModel({model: modelId, generationConfig: {
            temperature: temp,
            }});
        if (model === undefined) {
            return false;
        }
        this.concreteModel = model;
        return true;
        // Langchain --------------
        // this.concreteModel = new ChatGoogleGenerativeAI({
        //     model: "gemini-1.5-pro",
        //     temperature: 0,
        //     maxRetries: 2
        // });
    }

    process(): string {
        return "";
    }

    async executeChain(viewDesc: string, meta1Path: string, meta2Path: string, promptType: string): Promise<string> {
        console.log("executeChain() Gemini");

        const meta1: string = loadMetaSample(meta1Path);
        const meta2: string = loadMetaSample(meta2Path);

        const joinResult: string = await this.join(join_format_instructions, viewDesc, meta1, meta2);
        console.log("joinResult : " + joinResult);

        const selectResult: string = await this.select(select_format_instructions, viewDesc, meta1, meta2, joinResult);
        console.log("selectResult : " + selectResult);

        const whereResult: string = await this.where(where_format_instructions, viewDesc, meta1, meta2, joinResult);
        console.log("whereResult : " + whereResult);

        return `Join: ${joinResult}, Select: ${selectResult}, Where: ${whereResult}`;
    }

    async join(formatInstructions: string, viewDescription: string, meta1: string, meta2: string): Promise<string> {
        console.log("join() Gemini");

        const joinPrompt: string = joinBaselineCoTTemplateFun(formatInstructions, viewDescription, meta1, meta2);
        const chat: ChatSession = this.concreteModel.startChat();
        const result = await chat.sendMessage(joinPrompt);
        const response = result.response;
        return response.text();
    }

    async select(formatInstructions: string, viewDescription: string, meta1: string, meta2: string, join: string): Promise<string> {
        console.log("select() Gemini");

        const selectPrompt: string = selectBaselineCoTTemplateFun(formatInstructions, viewDescription, meta1, meta2, join);
        const chat: ChatSession = this.concreteModel.startChat();
        const result = await chat.sendMessage(selectPrompt);
        const response = result.response;
        return response.text();
    }

    async where(formatInstructions: string, viewDescription: string, meta1: string, meta2: string, join: string): Promise<string> {
        console.log("where() Gemini");

        const wherePrompt: string = whereBaselineCoTTemplateFun(formatInstructions, viewDescription, meta1, meta2, join);
        const chat: ChatSession = this.concreteModel.startChat();
        const result = await chat.sendMessage(wherePrompt);
        const response = result.response;
        return response.text();
    }


}