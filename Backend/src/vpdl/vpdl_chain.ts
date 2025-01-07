import {SelectRun} from "~/runnables/select_run";
import {JoinRun} from "~/runnables/join_run";
import {WhereRun} from "~/runnables/where_run";
import {RunnableBinding, RunnableLambda, RunnablePassthrough} from "@langchain/core/runnables";
import { LlmBase } from "~/llm/model/llmBase";

export interface VPDLInput {
    meta_1_path: string;
    meta_2_path: string;
    select: string;
    join: string;
    where: string;
}

export class VPDLChain {

    static async generateVpdlSkeletonWrapper(input: VPDLInput): Promise<string>{
        return VPDLChain.generateVpdlSkeleton(input, input.meta_1_path, input.meta_2_path);
    }

    static generateVpdlSkeleton(inputVpdl: VPDLInput, meta1: string, meta2: string): string {
        console.log("JE RECOIS : ", inputVpdl);

        console.log("Je parse JOIN : ", JSON.parse(inputVpdl.join));

        // Parse des chaînes JSON pour récupérer les objets
        const selectResult = JSON.parse(inputVpdl.select);  // Parse select
        const joinResult = JSON.parse(inputVpdl.join);      // Parse join
        const whereResult = JSON.parse(inputVpdl.where);    // Parse where

        let viewName = "publicationsAndBooks"; // Nom de la vue
        let selectClause: string[] = [];
        let joinClause: string[] = [];
        let fromClause: string[] = [];
        let whereClause: string[] = [];

        // 1. Générer la clause SELECT
        const publicationFields = selectResult.Publication || {};
        const bookFields = selectResult.Book || {};

        // Ajout des champs de Publication et Book dans le SELECT
        Object.keys(publicationFields).forEach(className => {
            publicationFields[className].forEach((field: any) => {
                selectClause.push(`publication.${className}.${field}`);
            });
        });

        Object.keys(bookFields).forEach(className => {
            bookFields[className].forEach((field: any) => {
                selectClause.push(`book.${className}.${field}`);
            });
        });

        // Si les chapitres sont sélectionnés, ajoutons-le
        if (bookFields["Book"] && bookFields["Book"].includes("chapters")) {
            selectClause.push(`book.Chapter.title`);
        }

        // 2. Générer la clause JOIN
        joinResult.relations.forEach((relation: { name: string; }) => {
            if (relation.name === "BookPublication") {
                joinClause.push(`publication.Publication join book.Book as firstBook`);
                joinClause.push(`publication.Publication join book.Chapter as firstChapter`);
            } else if (relation.name === "ChapterPublication") {
                joinClause.push(`publication.Publication join book.Chapter as bookChapters`);
            }
        });

        // 3. Générer la clause FROM
        fromClause.push(`'http://publication' as publication`);
        fromClause.push(`'http://book' as book`);

        // 4. Générer la clause WHERE
        whereResult.rules.forEach((rule: { rules: any[]; }) => {
            rule.rules.forEach(r => {
                if (r.combination_rule.includes("same title and author")) {
                    whereClause.push(`s.title = t.eContainer().title`);
                } else if (r.combination_rule.includes("first chapter")) {
                    whereClause.push(`t = t.eContainer().chapters.first()`);
                }
            });
        });

        // 5. Formater la requête VPDL
        const vpdl = `
create view ${viewName} as

select ${selectClause.join(', ')},

from ${fromClause.join(', ')},

where ${whereClause.join(' and ')}
      for firstChapter,
      ${whereClause.join(' and ')}
      for bookChapters
    `;

        return vpdl.trim();
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