import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, NumericLiteral, ObjectLiteral, Program, Statement, VarDeclaration } from "../core/ast.ts";
import Environment from "./environment.ts";
import { evaluateAssignment, evaluateBinaryExpression, evaluateCallExpression, evaluateIdentifier, evaluateObjectExpression } from "./evaluate/expressions.ts";
import { evaluateProgram, evaluateVarDeclaration } from "./evaluate/statement.ts";
import { NumberVal, RuntimeVal } from "./values.ts";


export function evaluate(astNode: Statement, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberVal;
    
    case "Identifier":
      return evaluateIdentifier(astNode as Identifier, env);
    
    case "ObjectLiteral":
      return evaluateObjectExpression(astNode as ObjectLiteral, env);
    
    case "AssignmentExpression":
      return evaluateAssignment(astNode as AssignmentExpression, env)
    
    case "BinaryExpression":
      return evaluateBinaryExpression(astNode as BinaryExpression, env);
    
    case "Program":
      return evaluateProgram(astNode as Program, env);

    case "VarDeclaration":
      return evaluateVarDeclaration(astNode as VarDeclaration, env);

    case "CallExpression":
      return evaluateCallExpression(astNode as CallExpression, env);
    default:
      console.error("This AST Node has not yet been setup for interpretation.", astNode);

      Deno.exit(0);
  }
}
