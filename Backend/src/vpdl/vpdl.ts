import { readFileSync } from "fs";
import { resolve } from "path";
import {VPDLChain} from "~/vpdl/vpdl_chain";

export class VPDL {

    llm: LlmBase;
    viewDescription: string;
    ecoreFilesPaths: string[];

    constructor(llm: LlmBase) {
        this.llm = llm;
        this.initVPDL();
    }

    initVPDL(): void {
        this.viewDescription = this.loadViewDescription()
        this.ecoreFilesPaths.push("../../SampleData/metamodels/Book.ecore", "../../SampleData/metamodels/Publication.ecore")
    }

    loadViewDescription(): string {
        const viewDescFilePath = resolve(__dirname, "../../SampleData/view_description.txt");
        try {
            const data = readFileSync(viewDescFilePath, 'utf-8');
            return data;
        } catch (error) {
            console.error("Error reading the file:", error);
            return "";
        }
    }

    runVPDL(): void {
        if(this.ecoreFilesPaths.length === 2) {
            VPDLChain.executeVPDLChain(this.llm, this.viewDescription, this.ecoreFilesPaths[0], this.ecoreFilesPaths[1], "baseline");
        }
    }
}