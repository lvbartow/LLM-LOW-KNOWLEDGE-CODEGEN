import { readFileSync } from "fs";
import { resolve } from "path";
import {LlmBase} from "~/llm/model/llmBase";

export class VPDL {

    llm: LlmBase;
    viewDescription: string;
    plantUmlFilesPaths: string[];

    constructor(llm: LlmBase) {
        this.llm = llm;
        this.plantUmlFilesPaths = [];
        this.llm.init(0.8);
        this.initVPDL();
    }

    private initVPDL(): void {
        this.viewDescription = this.loadViewDescription();
        this.plantUmlFilesPaths.push("../../../SampleData/metamodels/Book_PlantUML.txt", "../../../SampleData/metamodels/Publication_PlantUML.txt");
    }

    private loadViewDescription(): string {
        const viewDescFilePath = resolve(__dirname, "../../SampleData/view_description.txt");
        try {
            const data = readFileSync(viewDescFilePath, 'utf-8');
            return data;
        } catch (error) {
            console.error("Error reading the file:", error);
            return "";
        }
    }

    public runVPDL(): boolean {
        if(this.plantUmlFilesPaths.length === 2) {
            this.llm.executeChain(this.viewDescription, this.plantUmlFilesPaths[0], this.plantUmlFilesPaths[1], "baseline");
        }
        return true
    }
}