import {readFileSync} from "fs";
import {resolve} from "path";
import {LlmBase} from "~/llm/model/llmBase";

export class VPDL {

    llm: LlmBase;
    viewDescription: string;
    plantUmlFilesPaths: string[];
    temperature: number;

    constructor(llm: LlmBase, temperature: number) {
        this.llm = llm;
        this.plantUmlFilesPaths = [];
        this.initVPDL();
        this.temperature = temperature;
        this.llm.init(this.temperature);
    }

    private initVPDL(): void {
        this.viewDescription = this.loadViewDescription();
        this.plantUmlFilesPaths.push("../../../SampleData/metamodels/Book_PlantUML.txt", "../../../SampleData/metamodels/Publication_PlantUML.txt");
    }

    private loadViewDescription(): string {
        const viewDescFilePath = resolve(__dirname, "../../SampleData/view_description.txt");
        try {
            return readFileSync(viewDescFilePath, 'utf-8');
        } catch (error) {
            console.error("Error reading the file:", error);
            return "";
        }
    }

    public async runVPDL(userViewPath: string, ecoreFiles: string[]): Promise<string> {
        let chainResult = "";

        const viewDescriptionPath = userViewPath || this.loadViewDescription();
        const dynamicFiles = ecoreFiles.length > 0;

        if (ecoreFiles.length === 2 || this.plantUmlFilesPaths.length === 2) {
            if (dynamicFiles) chainResult = await this.llm.executeChain(viewDescriptionPath, ecoreFiles[0], ecoreFiles[1], "baseline", false);
            else chainResult = await this.llm.executeChain(viewDescriptionPath, this.plantUmlFilesPaths[0], this.plantUmlFilesPaths[1], "baseline", true);
        }
        return chainResult;
    }
}