import {GenerativeModel} from "@google/generative-ai";
import {resolve} from "path";
import {readFileSync} from "fs";

export abstract class LlmBase {
  abstract concreteModel: GenerativeModel | any;

  //Initialisation du modele
  abstract init(temperature: number): boolean;

  loadMetaSample(metaPath: string): string {
    const path : string = resolve(__dirname, metaPath)
    try {
      const data = readFileSync(path, 'utf-8');
      return data;
    } catch (error) {
      console.error("Error reading the file:", error);
      return "";
    }
  }

  abstract join(formatInstructions: String, viewDescription: String, meta1: String, meta2: String): Promise<string>;

  abstract select(formatInstructions: String, viewDescription: String, meta1: String, meta2: String, join: String):  Promise<string>;

  abstract where(formatInstruction: string, viewDesc: string, meta1: string, meta2: string, join: string):  Promise<string>;

  abstract executeChain(viewDesc: string, meta1: string, meta2: string, join: string): Promise<string>;

}