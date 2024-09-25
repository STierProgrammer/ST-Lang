import { RuntimeValue, NumberValue, NullValue } from "./values.ts"
import { BinaryExpression, NumericLiteral, Program, Statement } from "../core/ast.ts"

function evaluateProgram(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue;

    for(const statement of program.body) {
        lastEvaluated = evaluate(statement);
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

function evaluateBinaryExpression(binop: BinaryExpression): RuntimeValue {
    const leftSide = evaluate(binop.left);
    const rightSide = evaluate(binop.right);

    if (leftSide.type == "number" && rightSide.type == "number") {
        return evaluateNumericBinaryExpression(leftSide as NumberValue, rightSide as NumberValue, binop.operator);
    }

    return { type: "null", value: "null" } as NullValue;
}

export function evaluate(astNode: Statement): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: (astNode as NumericLiteral).value, type: "number" } as NumberValue;

        case "NullLiteral":
            return{ value: "null", type: "null" } as NullValue;

        case "BinaryExpression":
            return evaluateBinaryExpression(astNode as BinaryExpression);

        case "Program":
            return evaluateProgram(astNode as Program);

        default:
            console.error("This AST Node has not yet been set up for interretation.", astNode);
            Deno.exit(0);
    }
}