export interface VPDLInput {
    meta_1_path: string;
    meta_2_path: string;
    select: string;
    join: string;
    where: string;
}

export class VPDLChain {

    static generateVpdlSkeleton(inputVpdl: VPDLInput, meta1: string, meta2: string): string {
        // console.log("JE RECOIS : ", inputVpdl);
        // console.log("Je parse JOIN : ", JSON.parse(inputVpdl.join));

        // Parse des chaînes JSON pour récupérer les objets
        const selectResult = JSON.parse(inputVpdl.select);  // Parse select
        const joinResult = JSON.parse(inputVpdl.join);      // Parse join
        const whereResult = JSON.parse(inputVpdl.where);    // Parse where

        let viewName = "publicationsAndBooks"; // Nom de la vue
        let selectClause: string[] = [];
        let fromClause: string[] = [];
        let whereClause: string[] = [];

        // 1. Générer la clause SELECT
        for (const [key, value] of Object.entries(selectResult.filters)) {
            fromClause.push(`'http://${key.toLowerCase()}' as ${key.toLowerCase()}\n`); //Generation de la clause from
            for (const item of value as string[]) {
                selectClause.push(`${key.toLowerCase()}.${key}.${item}\n`);
            }
        }

        // 2. Générer à partir du JOIN
        joinResult.relations.forEach((relation: { name: string; classes: string[]}) => {
            selectClause.push(`${relation.classes[0].toLowerCase()}.${relation.classes[0]} join ${relation.classes[1].toLowerCase()}.${relation.classes[1]} as ${relation.name}\n`);
        });

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
        
        select 
        ${selectClause.join()}
        
        from ${fromClause.join(', ')},
        
        where ${whereClause.join(' and ')}
              for firstChapter,
              ${whereClause.join(' and ')}
              for bookChapters
            `;

                return vpdl.trim();
    }
}