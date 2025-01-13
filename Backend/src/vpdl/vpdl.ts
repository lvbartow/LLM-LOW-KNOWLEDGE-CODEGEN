import {readFileSync} from "fs";
import {resolve} from "path";
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
            return readFileSync(viewDescFilePath, 'utf-8');
        } catch (error) {
            console.error("Error reading the file:", error);
            return "";
        }
    }

    public async runVPDL(userViewPath: string, ecoreFiles: string[]): Promise<string> {
        let chainResult = "";

        const viewDescriptionPath = userViewPath || this.loadViewDescription();
        const plantUmlPaths = ecoreFiles.length > 0 ? ecoreFiles : this.plantUmlFilesPaths;

        if (plantUmlPaths.length === 2) {
            chainResult = await this.llm.executeChain(viewDescriptionPath, plantUmlPaths[0], plantUmlPaths[1], "baseline");
        }
        return chainResult;
    }
}