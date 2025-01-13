import { ModelsEnum } from "~/llm/model/modelsEnum";

export interface VPDLInput {
    meta_1_path: string;
    meta_2_path: string;
    select: string;
    join: string;
    where: string;
}

interface WhereRules {
    name: string;
    rules: WhereRule[];
}

export interface WhereRule {
       metaclass_1: string,
       combination_rule: string,
       metaclass_2: string
}

export class VPDLChain {
    static generateVpdlSkeleton(
        inputVpdl: VPDLInput,
        meta1: string,
        meta2: string,
        inputModel: ModelsEnum
    ): string {
        // Parse des chaînes JSON pour récupérer les objets
        const selectResult = JSON.parse(inputVpdl.select); // Parse select
        const joinResult = JSON.parse(inputVpdl.join);     // Parse join
        const whereResult = JSON.parse(inputVpdl.where);   // Parse where

        let viewName = "publicationsAndBooks"; // Nom de la vue
        let selectClause: string[] = [];
        let fromClause: string[] = [];
        let whereClause: string[] = [];

        // 1. Générer la clause SELECT
        if (inputModel === ModelsEnum.OPENAI) {
            for (const [key, value] of Object.entries(selectResult.filters)) {
                for (const [childKey, childValue] of Object.entries(value as object)) {
                    if (!fromClause.includes(`'http://${key.toLowerCase()}' as ${key.toLowerCase()}\n`)) {
                        fromClause.push(`'http://${key.toLowerCase()}' as ${key.toLowerCase()}\n`); // Génération de la clause FROM
                    }
                    for (const item of childValue as string[]) {
                        selectClause.push(`${key.toLowerCase()}.${childKey}.${item}\n`);
                    }
                }
            }
        } else if (inputModel === ModelsEnum.GEMINI) {
            for (const [key, value] of Object.entries(selectResult.filters)) {
                fromClause.push(`'http://${key.toLowerCase()}' as ${key.toLowerCase()}\n`);
                for (const item of value as string[]) {
                    selectClause.push(`${key.toLowerCase()}.${key}.${item}\n`);
                }
            }
        }

        // 2. Générer à partir du JOIN
        joinResult.relations.forEach((relation: { name: string; classes: string[] }) => {
            selectClause.push(
                `${relation.classes[0].toLowerCase()}.${relation.classes[0]} join ${relation.classes[1].toLowerCase()}.${relation.classes[1]} as ${relation.name}\n`
            );
        });

        // 3. Générer la clause WHERE
        whereResult.rules.forEach((rule: WhereRules) => {
            rule.rules.forEach((r: WhereRule, index: number) => {
                if (index === 0) {
                    whereClause.push(`${r.metaclass_1}.title = t.eContainer().${r.metaclass_2}\n`);
                } else {
                    whereClause.push(`and ${r.metaclass_1}.title = t.eContainer().${r.metaclass_2}\n`);
                }
            });
            whereClause.push(`for ${rule.name}\n`);
        });

        // 4. Formater la requête VPDL
        const vpdl = `
create view ${viewName} as

select 
    ${selectClause.join("    ").trim()}

from 
    ${fromClause.join("    ").trim()},

where 
    ${whereClause.join("    ").trim()}
        `;

        return vpdl.trim();
    }
}
