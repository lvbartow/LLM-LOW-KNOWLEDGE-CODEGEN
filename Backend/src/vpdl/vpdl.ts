import { readFileSync } from "fs";
import { resolve } from "path";
import {VPDLChain} from "~/vpdl/vpdl_chain";
import {LlmBase} from "~/llm/model/llmBase";

export class VPDL {

    llm: LlmBase;
    viewDescription: string;
    formatInstructions: string;
    plantUmlFilesPaths: string[];

    constructor(llm: LlmBase) {
        this.llm = llm;
        this.plantUmlFilesPaths = [];
        this.llm.init(0.2)
        this.initVPDL();
    }

    private initVPDL(): void {
        this.viewDescription = this.loadViewDescription();
        this.formatInstructions = this.loadFormatInstructions();
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

    private loadFormatInstructions(): string {
        const formatInstructionsFilePath = resolve(__dirname, "../../SampleData/format_instructions.txt");
        try {
            const data = readFileSync(formatInstructionsFilePath, 'utf-8');
            return data;
        } catch (error) {
            console.error("Error reading the file:", error);
            return "";
        }
    }


    public runVPDL(): boolean {
        if(this.plantUmlFilesPaths.length === 2) {
            this.llm.executeChain(this.formatInstructions, this.viewDescription, this.plantUmlFilesPaths[0], this.plantUmlFilesPaths[1], "baseline");
            // Lanchain
            // VPDLChain.executeVPDLChain(this.llm, this.viewDescription, this.ecoreFilesPaths[0], this.ecoreFilesPaths[1], "baseline");
        }
        return true
    }
}