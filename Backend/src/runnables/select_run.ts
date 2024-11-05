import {selectFewShotCoTTemplate} from "~/llm/prompts/select";
import { PromptTemplate } from "@langchain/core/prompts";

export class SelectRun {

    promptString : String
    concretePrompt: PromptTemplate

    constructor(formatInstructions: String) {
        this.promptString = selectFewShotCoTTemplate(formatInstructions);
    }
    
    setPrompt(): void {
        examplePromptTemplate =
        this.concretePrompt = new PromptTemplate({
            inputVariables = [],
            template = `View description:${view_desc}\nMetamodel 1: ${ex_meta_1}\nMetamodel 2: {ex_meta_2}\nRelations:{relations}\nSelect elements:{filters}`
            }
        )
    }

}