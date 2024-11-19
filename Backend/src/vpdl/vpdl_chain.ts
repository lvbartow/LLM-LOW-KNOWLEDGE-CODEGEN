import {SelectRun} from "~/runnables/select_run";
import {JoinRun} from "~/runnables/join_run";
import {WhereRun} from "~/runnables/where_run";
import {RunnableBinding, RunnableLambda, RunnablePassthrough} from "@langchain/core/runnables";
import { LlmBase } from "~/llm/model/llmBase";

export interface VPDLInput {
    meta_1_path: string;
    meta_2_path: string;
    select: {
        filters: {
            [metaName: string]: {
                [className: string]: string[];
            };
        };
    };
    join: {
        relations: {
            name: string;
            classes: string[];
        }[];
    };
    where: {
        rules: {
            name: string;
            rules: {
                combination_rule: string;
            }[];
        }[];
    };
}

export class VPDLChain {

    static async generateVpdlSkeletonWrapper(input: VPDLInput): Promise<string>{
        return VPDLChain.generateVpdlSkeleton(input, input.meta_1_path, input.meta_2_path);
    }

    static generateVpdlSkeleton(inputVpdl: VPDLInput, meta1: string, meta2: string): string {
        // const [meta1Uri, meta1Prefix] = ecoreParser.getMetamodelUri(meta1);
        // const [meta2Uri, meta2Prefix] = ecoreParser.getMetamodelUri(meta2);
        const [meta1Uri, meta1Prefix] = '';
        const [meta2Uri, meta2Prefix] = '';

        let vpdlSkeleton = "create view NAME as\n\nselect ";

        // Ajout des filtres (clause SELECT)
        for (const [metaName, filters] of Object.entries(inputVpdl.select.filters)) {
            for (const [className, attributes] of Object.entries(filters)) {
                for (const attr of attributes) {
                    vpdlSkeleton += `${metaName}.${className}.${attr},\n`;
                }
            }
        }

        // Ajout des relations (clause JOIN)
        for (const relation of inputVpdl.join.relations) {
            const className1 = relation.classes[0];
            const className2 = relation.classes[1];
            vpdlSkeleton += `${meta1Prefix}.${className1} join ${meta2Prefix}.${className2} as ${relation.name},\n`;
        }

        // Inclure les métamodèles et leurs identifiants
        vpdlSkeleton += `\n\nfrom '${meta1Uri}' as ${meta1Prefix},\n     '${meta2Uri}' as ${meta2Prefix},\n\nwhere `;

        // Ajout des conditions de jointure (clause WHERE)
        for (const combination of inputVpdl.where.rules) {
            const relationName = combination.name;
            const rules = combination.rules
                .map(rule => `\`${rule.combination_rule}\``)
                .join("\n      ");
            vpdlSkeleton += `${rules} for ${relationName}\n`;
        }

        return vpdlSkeleton;
    }

    //this.llm, this.viewDescription, this.ecoreFilesPaths[0], this.ecoreFilesPaths[1], "baseline"
    static async executeVPDLChain(
        llm: LlmBase,
        viewDesc: string,
        meta1Path: string,
        meta2Path: string,
        promptType: string
    ): Promise<any> {

        // Simule le chargement des fichiers ecore
        const meta1: string = "";  // Charger le contenu de meta1 ici
        const meta2: string = "";  // Charger le contenu de meta2 ici

        // JOIN
        const joinRunnable = new JoinRun(llm);
        joinRunnable.setPrompt();
        const joinChain = joinRunnable.getRunnable();

        // SELECT
        const selectRunnable = new SelectRun(llm);
        selectRunnable.setPrompt();
        const selectChain = selectRunnable.getRunnable();

        // WHERE
        const whereRunnable = new WhereRun(llm);
        whereRunnable.setPrompt();
        const whereChain = whereRunnable.getRunnable();

        // Construction de la chaîne
        const {generateVpdlSkeletonWrapper: generateVpdlSkeletonWrapper1} = VPDLChain;


        const fullChain = RunnablePassthrough.assign({
            join: joinChain
        }).withConfig({ runName: "JOIN" })
        //     .assign({
        //     meta1: meta1,
        //     meta2: meta2,
        //     meta_1_path: meta1Path,
        //     meta_2_path: meta2Path,
        //     viewDescription: viewDesc,
        //     join: joinChain
        // })
            .pipe(
                new RunnablePassthrough().assign({select: selectChain})
                    .withConfig({runName: "SELECT"})
            )
            .pipe(
                new RunnablePassthrough().assign({
                    where: whereChain
                }).withConfig({ runName: "WHERE" })
            )
            // .pipe(
            //     new RunnablePassthrough().assign({
            //         // @ts-ignore
            //         vpdl_draft: new RunnableLambda(VPDLChain.generateVpdlSkeletonWrapper)
            //     }).withConfig({ runName: "VPDL_DRAFT" })
            // );

        // Exécution de la chaîne
        const fullResult = await fullChain.invoke({
            meta1: meta1,
            meta2: meta2,
            meta_1_path: meta1Path,
            meta_2_path: meta2Path,
            viewDescription: viewDesc,
            context: null
        });

        console.log(fullResult);
    }



}