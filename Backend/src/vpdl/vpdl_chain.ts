import {SelectRun} from "~/runnables/select_run";
import {JoinRun} from "~/runnables/join_run";
import {WhereRun} from "~/runnables/where_run";
import {RunnableLambda, RunnablePassthrough} from "@langchain/core/runnables";

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

    generateVpdlSkeletonWrapper(input: VPDLInput): string {
        return this.generateVpdlSkeleton(input, input.meta_1_path, input.meta_2_path);
    }

    generateVpdlSkeleton(inputVpdl: VPDLInput, meta1: string, meta2: string): string {
        const [meta1Uri, meta1Prefix] = ecoreParser.getMetamodelUri(meta1);
        const [meta2Uri, meta2Prefix] = ecoreParser.getMetamodelUri(meta2);

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
    static executeVPDLChain(llm: LlmBase, viewDesc: String, meta1Path: string, meta2Path: String, promptType: string): any {

        //TODO : load ecore files to get content directly from files
        const meta1: string = ""
        const meta2: string = ""

        //Join
        const joinRunnable = new JoinRun(llm);
        joinRunnable.setPrompt();
        const joinChain = joinRunnable.getRunnable()
        //Select
        const selectRunnable = new SelectRun(llm);
        selectRunnable.setPrompt();
        const selectChain = selectRunnable.getRunnable();
        //Where
        const whereRunnable = new WhereRun(llm);
        whereRunnable.setPrompt();
        const whereChain = whereRunnable.getRunnable();

        const fullChain = RunnablePassthrough.assign({
            join: joinChain
        }).withConfig({runName: "JOIN"}).pipe(
            new RunnablePassthrough().assign({
                meta_1: meta1,
                meta_2: meta2,
                meta_1_path: meta1Path,
                meta_2_path: meta2Path,
                view_description: viewDesc,
                join: joinChain
            }).withConfig({runName: "META_SETUP"}) // Ajout d'une étape intermédiaire pour configurer les métadonnées
        )
            .pipe(
                new RunnablePassthrough().assign({select: selectChain})
                    .withConfig({runName: "SELECT"})
            )
            .pipe(
                new RunnablePassthrough().assign({where: whereChain})
                    .withConfig({runName: "WHERE"})
            )
            .pipe(
                new RunnablePassthrough().assign({
                    vpdl_draft: new RunnableLambda(() => this.generateVpdlSkeletonWrapper()) // Si 'generateVpdlSkeletonWrapper' est une fonction asynchrone
                })
                    .withConfig({runName: "VPDL_DRAFT"})
            );
    }

}