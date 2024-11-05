import * as dotenv from "dotenv";
import {GenerativeModel, GoogleGenerativeAI} from "@google/generative-ai";

export class Gemini extends LlmBase {

    concreteModel: any;
    temperature: number; //Avec Gemini la temp est à passer dans la requte et pas au moment de la configuration du model

    constructor() {
        super();
    }

    init(temperature: number): boolean {
        dotenv.config();

        // GoogleGenerativeAI required config
        const configuration = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY || "None"
        );

        // Erreur API key
        if (configuration.apiKey === "None"){
            return false;
        }

        // Model initialization
        const modelId = "gemini-pro";
        const model = configuration.getGenerativeModel({model: modelId, });
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