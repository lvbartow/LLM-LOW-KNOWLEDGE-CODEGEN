import {GenerativeModel} from "@google/generative-ai";

export abstract class LlmBase {

  abstract concreteModel: GenerativeModel | any;

  //Initialisation du modele
  abstract init(temperature: number): boolean;

  abstract executeChain(viewDesc: string, meta1Path: string, meta2Path: string, promptType: string):  Promise<string>;

  abstract join(formatInstructions: String, viewDescription: String, meta1: String, meta2: String): Promise<string>;

  abstract select(formatInstructions: String, viewDescription: String, meta1: String, meta2: String, join: String):  Promise<string>;

  abstract where(formatInstruction: string, viewDesc: string, meta1: string, meta2: string, join: string):  Promise<string>;


}