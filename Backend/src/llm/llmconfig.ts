import {Gemini} from "~/llm/model/gemini";
import {OpenAi} from "~/llm/model/openai";
import {LlmBase} from "~/llm/model/llmBase";

class LlmConfig {

    llmType: LlmEnum; //GEMINI ou OPENAI
    model: LlmBase;
    temperature: number;


    constructor(llmType: LlmEnum, temperature: number) {
        this.llmType = llmType;
        this.temperature = temperature;
    }

    init(): any {
        if(this.llmType === LlmEnum.GEMINI){
            this.model = new Gemini();
        }
        else{
            this.model = new OpenAi();
        }
        this.model.init(this.temperature);

    }

}