import {Gemini} from "~/llm/model/gemini";
import {OpenAi} from "~/llm/model/openai";

class LlmConfig {

    llmType: LlmEnum; //GEMINI ou OPENAI
    model: LlmBase;

    constructor(llmType: LlmEnum) {
        this.llmType = llmType;
        if(llmType === LlmEnum.GEMINI){
            this.model = new Gemini();
        }
        else{
            this.model = new OpenAi();
        }
        this.model.init();
    }

}