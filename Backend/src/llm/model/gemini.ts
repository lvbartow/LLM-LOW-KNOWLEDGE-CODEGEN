import * as dotenv from "dotenv";
import {ChatSession, GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";
import {LlmBase} from "~/llm/model/llmBase";
import {join_format_instructions, joinBaselineCoTTemplateFun} from "~/llm/prompts/join";
import {select_format_instructions, selectBaselineCoTTemplateFun} from "~/llm/prompts/select";
import {where_format_instructions, whereBaselineCoTTemplateFun} from "~/llm/prompts/where";
import {VPDLChain, VPDLInput} from "~/vpdl/vpdl_chain";
import {ModelsEnum} from "~/llm/model/modelsEnum";

export class Gemini extends LlmBase {

    concreteModel: GenerativeModel;

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
    }

    process(): string {
        return "";
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

    async executeChain(viewDesc: string, meta1Path: string, meta2Path: string, promptType: string, useSampleData: boolean):  Promise<string> {
        const meta1: string = (useSampleData) ? this.loadMetaSample(meta1Path) : meta1Path;
        const meta2: string = (useSampleData) ? this.loadMetaSample(meta2Path) : meta2Path;

        const joinResult: string = await this.join(join_format_instructions, viewDesc, meta1, meta2);
        console.log("joinResult : " + joinResult);

        const selectResult: string = await this.select(select_format_instructions, viewDesc, meta1, meta2, joinResult);
        console.log("selectResult : " + selectResult);

        const whereResult: string = await this.where(where_format_instructions, viewDesc, meta1, meta2, joinResult);
        console.log("whereResult : " + whereResult);

        const inputVpdl: VPDLInput = {
            meta_1_path: meta1Path,
            meta_2_path: meta2Path,
            select: selectResult,
            join: joinResult,
            where: whereResult
        };

        const fullResult = VPDLChain.generateVpdlSkeleton(inputVpdl, meta1, meta2, ModelsEnum.GEMINI);

        console.log("fullResult : " + fullResult);

        return fullResult;
    }


}