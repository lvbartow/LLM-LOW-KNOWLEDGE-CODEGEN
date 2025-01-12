import {LlmBase} from "~/llm/model/llmBase";
import {OpenAI} from "openai";
import * as dotenv from "dotenv";
import {join_format_instructions, joinBaselineCoTTemplateFun} from "~/llm/prompts/join";
import {select_format_instructions, selectBaselineCoTTemplateFun} from "~/llm/prompts/select";
import {where_format_instructions, whereBaselineCoTTemplateFun} from "~/llm/prompts/where";
import {VPDLChain, VPDLInput} from "~/vpdl/vpdl_chain";
import {ModelsEnum} from "~/llm/model/modelsEnum";

export class MyOpenAI extends LlmBase {
  concreteModel: OpenAI;
  temp : number;

  constructor() {
    super();
  }

  init(temperature: number): boolean {
    dotenv.config();
    console.log("Init OpenAI");

    this.temp = temperature;

    if (process.env.OPENAI_API_KEY === undefined) return false;

    // GoogleGenerativeAI required config
    this.concreteModel = new OpenAI({
        apiKey: process.env["OPENAI_API_KEY"]
    });

    return true;
  }

  createChatParams(message: string) : OpenAI.Chat.ChatCompletionCreateParams {
    return {
      messages: [{role: "user", content: message}],
      model: "gpt-4o-mini",
      temperature: this.temp
    }
  }

  async join(formatInstructions: string, viewDescription: string, meta1: string, meta2: string): Promise<string> {
    console.log("join() OpenAI");

    const joinPrompt: string = joinBaselineCoTTemplateFun(formatInstructions, viewDescription, meta1, meta2);
    const params = this.createChatParams(joinPrompt);
    // @ts-ignore
    const completion: Stream<OpenAI.ChatCompletionChunk> | OpenAI.ChatCompletion = await this.concreteModel.chat.completions.create(params);
    try{
      let result = completion.choices[0].message?.content;
      if (result === null) result = "";
      return result ;
    }catch(e : any){
      console.log("erreur : " + e.toString())
    }
    return "";
  }

  async select(formatInstructions: string, viewDescription: string, meta1: string, meta2: string, join: string): Promise<string> {
    console.log("select() OpenAI");

    const selectPrompt: string = selectBaselineCoTTemplateFun(formatInstructions, viewDescription, meta1, meta2, join);
    const params = this.createChatParams(selectPrompt);
    const completion: OpenAI.Chat.ChatCompletion = <OpenAI.ChatCompletion> await this.concreteModel.chat.completions.create(params);
    let result = completion.choices[0].message.content;
    if (result === null) result = "";
    return result ;
  }

  async where(formatInstruction: string, viewDesc: string, meta1: string, meta2: string, join: string): Promise<string> {
    console.log("where() OpenAI");
    const wherePrompt: string = whereBaselineCoTTemplateFun(formatInstruction, viewDesc, meta1, meta2, join);
    const params = this.createChatParams(wherePrompt);
    const completion: OpenAI.Chat.ChatCompletion = <OpenAI.ChatCompletion> await this.concreteModel.chat.completions.create(params);
    let result = completion.choices[0].message.content;
    if (result === null) result = "";
    return result ;
  }

  async executeChain(viewDesc: string, meta1Path: string, meta2Path: string, promptType: string):  Promise<string> {
    const meta1: string = this.loadMetaSample(meta1Path);
    const meta2: string = this.loadMetaSample(meta2Path);

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

    const fullResult = VPDLChain.generateVpdlSkeleton(inputVpdl, meta1, meta2, ModelsEnum.OPENAI);

    console.log("fullResult : " + fullResult);

    return fullResult;
  }
}