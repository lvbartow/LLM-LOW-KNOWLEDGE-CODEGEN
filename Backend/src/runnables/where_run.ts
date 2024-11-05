import {selectBaselineCoTTemplate} from "~/llm/prompts/select";
import { PromptTemplate } from "@langchain/core/prompts";
import {whereBaselineCoTTemplate} from "~/llm/prompts/where";
import {Runnable} from "@langchain/core/runnables";

export class WhereRun {

    promptTemplate : string
    concretePrompt: PromptTemplate
    model: any

    constructor(llm: LlmBase) {
        this.promptTemplate = whereBaselineCoTTemplate
        this.model = llm.concreteModel
    }

    setPrompt(): void {
        this.concretePrompt = new PromptTemplate({
                inputVariables: ["viewDesc", "meta1", "meta2", "join"],
                template : this.promptTemplate
                // TODO : format instructions
                // partialVariables: {"format_instructions", }
            }
        )
    }

    getRunnable(): Runnable<any, Exclude<unknown, Error>>{
        const chain = this.concretePrompt.pipe(this.model);
        return chain;
    }

}