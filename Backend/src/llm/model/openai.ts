import {LlmBase} from "~/llm/model/llmBase";

export class OpenAi extends LlmBase {

    concreteModel: any;

    constructor() {
        super();
    }

    init(): boolean {
        return false;
    }

    process(): string {
        return "";
    }

    executeChain(): string {
        return "";
    }

    async join(formatInstructions: String, viewDescription: String, meta1: String, meta2: String): Promise<string> {
        return "";
    }

    select(formatInstructions: String, viewDescription: String, meta1: String, meta2: String, join: String): string {
        return "";
    }

    where(formatInstruction: string, viewDesc: string, meta1: string, meta2: string, join: string): string {
        return "";
    }



}