import {SelectRun} from "~/runnables/select_run";

export class VPDLChain {

    //this.llm, this.viewDescription, this.ecoreFilesPaths[0], this.ecoreFilesPaths[1], "baseline"
    static executeVPDLChain (llm: LlmBase, viewDesc:String, meta1Path: string, meta2Path: String, promptType: string): any {

        //TODO : load ecore files to get content directly from files

        //Join
        //Select
        selectRunnable = new SelectRun();
        //Where

    }

}