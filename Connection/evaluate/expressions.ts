import Environment from "../environment.ts";
import { AssignmentExpression, BinaryExpression, Identifier } from "../../core/ast.ts";
import { evaluate } from "../interpreter.ts";
import { MAKE_NULL, NumberVal, RuntimeVal } from "../values.ts";

function evaluateNumericBinaryExpression(lhs: NumberVal, rhs: NumberVal, operator: string,): NumberVal {
  let result: number;

  if (operator == "+") 
    result = lhs.value + rhs.value;

  else if (operator == "-") 
    result = lhs.value - rhs.value;
  
  else if (operator == "*") 
    result = lhs.value * rhs.value;
  
  else if (operator == "/") 
    result = lhs.value / rhs.value;
  
  else 
    result = lhs.value % rhs.value;

  return { value: result, type: "number" };
}

export function evaluateBinaryExpression(binop: BinaryExpression, env: Environment): RuntimeVal {
  const lhs = evaluate(binop.left, env);
  const rhs = evaluate(binop.right, env);

  if (lhs.type == "number" && rhs.type == "number") 
    return evaluateNumericBinaryExpression(lhs as NumberVal, rhs as NumberVal, binop.operator);
  
  return MAKE_NULL();
}

export function evaluateIdentifier(ident: Identifier, env: Environment,): RuntimeVal {
  const val = env.lookupVar(ident.symbol);
  
  return val;
}

export function evaluateAssignment (node: AssignmentExpression, env: Environment): RuntimeVal {
    if(node.assigne.kind !== "Identifier") 
      throw `Invalid assignment expression ${JSON.stringify(node.assigne)}`; 
    
    const varname = (node.assigne as Identifier).symbol;

    return env.assignVar(varname, evaluate(node.value, env));
}