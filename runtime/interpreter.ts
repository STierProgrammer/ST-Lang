import { RuntimeValue, NumberValue, MAKE_NULL } from "./values.ts"
import { BinaryExpression, Identifier, NumericLiteral, Program, Statement } from "../core/ast.ts"
import Environment from "./environment.ts";

function evaluateProgram(program: Program, environment: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MAKE_NULL();
    for(const statement of program.body) {
        lastEvaluated = evaluate(statement, environment);
    }

    return lastEvaluated;
}

function evaluateNumericBinaryExpression(leftSide: NumberValue, rightSide: NumberValue, operator: string): NumberValue {
    let result: number;
    
    if (operator == "+") 
        result = leftSide.value + rightSide.value;
    
    else if (operator == "-") 
        result = leftSide.value - rightSide.value;
      
    else if( operator == "*") 
        result = leftSide.value * rightSide.value;
    
    else if (operator == "/") 
        // TODO: Don't allow division by 0
        result = leftSide.value / rightSide.value;
    
    else if(operator == "%") 
        result = leftSide.value % rightSide.value;
    
    else 
        // TODO: Fix this
        result = -1.2;

    return { value: result, type: "number" }
}

function evaluateBinaryExpression(binop: BinaryExpression, environment: Environment): RuntimeValue {
    const leftSide = evaluate(binop.left, environment);
    const rightSide = evaluate(binop.right, environment);

    if (leftSide.type == "number" && rightSide.type == "number") {
        return evaluateNumericBinaryExpression(leftSide as NumberValue, rightSide as NumberValue, binop.operator);
    }

    return MAKE_NULL();
}

function evaluateIdentifier(identifier: Identifier, environment: Environment): RuntimeValue {
    const value = environment.lookupVariable(identifier.symbol);

    return value;
}

export function evaluate(astNode: Statement, environment: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: (astNode as NumericLiteral).value, type: "number" } as NumberValue;

        case "Identifier":
            return evaluateIdentifier(astNode as Identifier, environment);

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression, environment);

        case "Program":
            return evaluateProgram(astNode as Program, environment);

        default:
            console.error("This AST Node has not yet been set up for interretation.", astNode);
            Deno.exit(0);
    }
}