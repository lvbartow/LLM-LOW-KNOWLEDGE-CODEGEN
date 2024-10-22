import * as dotenv from "dotenv";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";

export class Gemini extends LlmBase {

    concreteModel: any;

    constructor() {
        super();
    }

    init(): boolean {
        dotenv.config();

        // GoogleGenerativeAI required config
        const configuration = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY || "None"
        );

        // Model initialization
        const modelId = "gemini-pro";
        const model = configuration.getGenerativeModel({model: modelId});
        if (model === undefined) {
            return false;
        }
        this.concreteModel = model;
        return true;
    }

    process(): string {
        return "";
    }
}