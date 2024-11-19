export const joinBaselineCoTTemplateFun = (formatInstructions: string, viewDescription: string,
  meta1: string, meta2: string): string => {
    return `You are now a PlantUML analyst tasked with finding relationships between classes from two metamodels.
# TASK
Analyze the input metamodels and the view description to define a list of relations between the metamodels' classes. 
Each relation must combine one class from the first metamodel with one from the second metamodel. Classes can be paired when they represent the same domain object, are complementary, or when the view description specifies attributes from one metamodel to appear in the other.
# OUTPUT DATA FORMAT
${formatInstructions}
# RULES
When generating the JSON response, follow these rules:
- Use only class names that exist in the metamodels. Do not include any classes that are not in the metamodels.
- Ensure each relation's name is unique and meaningful.
# STEP-BY-STEP PROCESS
1. Identify all classes from the first metamodel.
2. Identify all classes from the second metamodel.
3. Combine classes in pairs when they represent the same domain object in each metamodel.
4. Combine classes in pairs when one class in the second metamodel can be complemented by a class in the first metamodel and vice-versa.
5. Analyze the view description for other potential relations.
6. Ensure each pair includes one class from each metamodel.
7. Ensure each relation's name is unique and meaningful.
8. Verify all classes exist in the PlantUML metamodels.
9. Create a JSON array with the combination pairs.
10. Provide only the valid JSON response without any explanation or delimiters.
# INPUT
View description: ${viewDescription}
Metamodel 1: ${meta1}
Metamodel 2: ${meta2}
Relations:`
}

export const joinBaselineCoTTemplate : string =
     `You are now a PlantUML analyst tasked with finding relationships between classes from two metamodels.

# TASK
Analyze the input metamodels and the view description to define a list of relations between the metamodels' classes. 
Each relation must combine one class from the first metamodel with one from the second metamodel. Classes can be paired when they represent the same domain object, are complementary, or when the view description specifies attributes from one metamodel to appear in the other.

# OUTPUT DATA FORMAT
{formatInstructions}

# RULES
When generating the JSON response, follow these rules:
- Use only class names that exist in the metamodels. Do not include any classes that are not in the metamodels.
- Ensure each relation's name is unique and meaningful.

# STEP-BY-STEP PROCESS
1. Identify all classes from the first metamodel.
2. Identify all classes from the second metamodel.
3. Combine classes in pairs when they represent the same domain object in each metamodel.
4. Combine classes in pairs when one class in the second metamodel can be complemented by a class in the first metamodel and vice-versa.
5. Analyze the view description for other potential relations.
6. Ensure each pair includes one class from each metamodel.
7. Ensure each relation's name is unique and meaningful.
8. Verify all classes exist in the PlantUML metamodels.
9. Create a JSON array with the combination pairs.
10. Provide only the valid JSON response without any explanation or delimiters.

# INPUT
View description: {viewDescription}
Metamodel 1: {meta1}
Metamodel 2: {meta2}
Relations:`

//FewShot = consiste à montrer au modèle quelques exemples (appelés "shots" en anglais) de ce que vous voulez qu'il fasse
export const joinFewShotCoTTemplate = (formatInstructions: String) : String => {
    return `You are now a PlantUML analyst that finds relations between classes from two metamodels.

# TASK
Your task is to analyze the input metamodel and the view description and define a list of relations between the metamodels' classes.
The classes are always combined in pairs, one coming from the first metamodel and the other coming from the second metamodel.
Classes can be combined when they represent the same domain object or when they are complementary classes, which means that one can be extended with the attributes of the other.

Other possible reasons for combinations include when the view description explicitly mentions attributes from one metamodel that should appear in the other.

Your answer should be a valid JSON list of dictionaries where each dictionary entry represents a relation.
It should be a list even when it contains just one relation.
Each relation always contains precisely one class from each metamodel.
In your response, the classes are always in order: the first class comes from the first metamodel, and the second class comes from the second metamodel.

# OUTPUT DATA FORMAT
{formatInstructions}

# RULES
When generating the JSON response, you should follow these rules:
- Only use class names that exist in the metamodels. Never include classes that are not in the metamodels.
- The relation's name can be any string, but it should be unique and meaningful for each relation.

# STEP BY STEP PROCESS
1. Identify all the classes from the first metamodel.
2. Identify all the classes from the second metamodel.
3. Given the metamodels and their classes, combine the elements in pairs when the selected classes represent the same domain object in each metamodel.
4. Combine the elements in pairs when a class in the second metamodel can be complemented by a class in the first metamodel and vice-versa.
5. Analyze the view description to find other potential relations.
6. Ensure that the classes are combined in pairs, one from each metamodel.
7. Ensure that the relation's name is unique and meaningful.
8. Ensure that all the classes exist in the PlantUML metamodels.
9. Create the JSON array with the combination pairs.
10. Provide the answer.

You can think step-by-step, but your final answer should contain only the valid JSON and nothing else. Exclude any explanation or delimiter from the final response.

# EXAMPLES
`;
}