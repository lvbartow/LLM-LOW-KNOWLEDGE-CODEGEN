import {selectBaselineCoTTemplate} from "~/llm/prompts/select";
import {PromptTemplate} from "@langchain/core/prompts";
import {joinBaselineCoTTemplate} from "~/llm/prompts/join";
import {Runnable, RunnableLambda, RunnableParallel} from "@langchain/core/runnables";
import {LlmBase} from "~/llm/model/llmBase";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";

export class JoinRun {

    promptTemplate: string
    concretePrompt: PromptTemplate
    model: any

    constructor(llm: LlmBase) {
        this.promptTemplate = joinBaselineCoTTemplate
        // this.model = llm.concreteModel
        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-pro",
            temperature: 0,
            maxRetries: 2
        });
    }

    setPrompt(): void {
        this.concretePrompt = new PromptTemplate({
                inputVariables: ["viewDescription", "meta1", "meta2"],
                template: this.promptTemplate,
                // TODO : format instructions
                partialVariables: {
                    "formatInstructions": 'The output should be formatted as a JSON instance that conforms to the JSON schema below.' +
                        'As an example, for the schema {"properties": {"foo": {"title": "Foo", "description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}' +
                        'the object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema. The object {"properties": {"foo": ["bar", "baz"]}} is not well-formatted.' +
                        'Here is the output schema: ' +
                        '{"properties": {"foo": {"description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}'
                }
            }
        )
    }

    getRunnable(): Runnable<any, Exclude<unknown, Error>> {
        const chain = this.concretePrompt.pipe(this.model);
        return chain;
    }

}