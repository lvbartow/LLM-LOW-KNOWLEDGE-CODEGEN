export const where_format_instructions = `
The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {{"properties": {{"foo": {{"title": "Foo", "description": "a list of strings", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}
the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of the schema. The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Here is the output schema:
\`\`\`
{"properties": {"rules": {"title": "Rules", "description": "List of rules for each relation", "type": "array", "items": {"$ref": "#/definitions/Rules"}}}, "required": ["rules"], "definitions": {"RuleElement": {"title": "RuleElement", "type": "object", "properties": {"metaclass_1": {"title": "Metaclass 1", "description": "Name of the metaclass from metamodel 1", "type": "string"}, "combination_rule": {"title": "Combination Rule", "description": "Combination rule string explaining how the classes can be logically connected according to the domain's semantics", "type": "string"}, "metaclass_2": {"title": "Metaclass 2", "description": "Name of the metaclass from metamodel 2", "type": "string"}}, "required": ["metaclass_1", "combination_rule", "metaclass_2"]}, "Rules": {"title": "Rules", "type": "object", "properties": {"name": {"title": "Name", "description": "Name of the relation", "type": "string"}, "rules": {"title": "Rules", "description": "List of rules", "type": "array", "items": {"$ref": "#/definitions/RuleElement"}}}, "required": ["name", "rules"]}}}
\`\`\`
`

export const whereBaselineCoTTemplateFun = (formatInstructions: string,
  viewDescription: string, meta1: string, meta2: string, join: string): string => {
    return `You specialize in reasoning on PlantUML metamodels, especially combining and merging them.
# TASK
Given two metamodels, a list of relations containing class pairs, and a view description, your task is to define how to combine the given classes.
You must define the combination rules to merge classes from both metamodels.
# INPUT TEMPLATE FOR RELATIONS
The input relations list will be in the following format:
{
    "relations": [
        {
            "name": "relationName",
            "classes": ["class_name_from_first_metamodel", "class_name_from_second_metamodel"]
        }
    ]
}
# OUTPUT DATA FORMAT
${formatInstructions}
# RULES
When generating the response text, follow these rules:
- Only use class and attribute names that actually exist in the metamodels. Do not invent new names.
- The combination_rule should explain how the classes can be connected according to the domain's semantics, including the type of comparisons used to connect the classes in the relation.
# STEP-BY-STEP PROCESS
1. Select Metamodels: Identify the metamodels to be analyzed for each relation in the list of relations.
2. Analyze Domain: For each pair of metamodel classes, analyze the domain considering the view description and propose a combination to relate both classes.
3. Create Combination Rule: Create a JSON array with the combination rule for each relation. The combination rule should include the name of the first metaclass, the combination explanation, and the name of the second metaclass.
4. Compile JSON Array: Compile a JSON array with one rule per relation.
5. Provide Final Answer: Deliver the final JSON array as the response.
Your output should contain only the valid JSON and nothing else. Exclude any explanation or delimiter from the final response.
# INPUT
View description: ${viewDescription}
Metamodel 1: ${meta1}
Metamodel 2: ${meta2}
List of relations: ${join}
Combination rules:`;
    ;
}

export const whereBaselineCoTTemplate : string =
    `You specialize in reasoning on PlantUML metamodels, especially combining and merging them.

# TASK
Given two metamodels, a list of relations containing class pairs, and a view description, your task is to define how to combine the given classes.

You must define the combination rules to merge classes from both metamodels.

# INPUT TEMPLATE FOR RELATIONS
The input relations list will be in the following format:
{{
    "relations": [
        {{
            "name": "relationName",
            "classes": ["class_name_from_first_metamodel", "class_name_from_second_metamodel"]
        }}
    ]
}}

# OUTPUT DATA FORMAT
{formatInstructions}

# RULES
When generating the response text, follow these rules:
- Only use class and attribute names that actually exist in the metamodels. Do not invent new names.
- The combination_rule should explain how the classes can be connected according to the domain's semantics, including the type of comparisons used to connect the classes in the relation.

# STEP-BY-STEP PROCESS
1. Select Metamodels: Identify the metamodels to be analyzed for each relation in the list of relations.
2. Analyze Domain: For each pair of metamodel classes, analyze the domain considering the view description and propose a combination to relate both classes.
3. Create Combination Rule: Create a JSON array with the combination rule for each relation. The combination rule should include the name of the first metaclass, the combination explanation, and the name of the second metaclass.
4. Compile JSON Array: Compile a JSON array with one rule per relation.
5. Provide Final Answer: Deliver the final JSON array as the response.

Your output should contain only the valid JSON and nothing else. Exclude any explanation or delimiter from the final response.

# INPUT
View description: {viewDescription}
Metamodel 1: {meta1}
Metamodel 2: {meta2}
List of relations: {join}
Combination rules:`;

export const whereFewShotCoTTemplate = (formatInstructions: string) : string => {
    return `You specialize in reasoning on PlantUML metamodels, especially combining and merging them.

# TASK
Given two metamodels, a list of relations containing class pairs, and a view description, your task is to define how to combine the given classes.

You must define the combination rules to merge classes from both metamodels.

# INPUT TEMPLATE FOR RELATIONS
The input relations list will be in the following format:
{
  "relations": [
    {
      "name": "relationName",
      "classes": ["class_name_from_first_metamodel", "class_name_from_second_metamodel"]
    }
  ]
}

# OUTPUT DATA FORMAT
{formatInstructions}

# RULES
When generating the response text, follow these rules:
- Only use class and attribute names that actually exist in the metamodels. Do not invent new names.
- The combination_rule should explain how the classes can be connected according to the domain's semantics, including the type of comparisons used to connect the classes in the relation.

# STEP-BY-STEP PROCESS
1. Select Metamodels: Identify the metamodels to be analyzed for each relation in the list of relations.
2. Analyze Domain: For each pair of metamodel classes, analyze the domain considering the view description and propose a combination to relate both classes.
3. Create Combination Rule: Create a JSON array with the combination rule for each relation. The combination rule should include the name of the first metaclass, the combination explanation, and the name of the second metaclass.
4. Compile JSON Array: Compile a JSON array with one rule per relation.
5. Provide Final Answer: Deliver the final JSON array as the response.

Your output should contain only the valid JSON and nothing else. Exclude any explanation or delimiter from the final response.

# EXAMPLES
`
}