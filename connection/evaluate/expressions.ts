import Environment from "../environment.ts";
import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, ObjectLiteral } from "../../core/ast.ts";
import { evaluate } from "../interpreter.ts";
import { MAKE_NULL, NativeFunctionValue, NumberVal, ObjectVal, RuntimeVal } from "../values.ts";

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

export function evaluateObjectExpression (obj: ObjectLiteral, env: Environment): RuntimeVal {
  const object = { type: "object", properties: new Map()} as ObjectVal;

  for (const { key, value } of obj.properties) {
    const runtimeVal = (value == undefined) ? env.lookupVar(key) : evaluate(value, env);

    object.properties.set(key, runtimeVal);
  }

  return object;
}

export function evaluateCallExpression (expression: CallExpression, env: Environment): RuntimeVal {
  const args = expression.args.map((arg) => evaluate(arg, env));
  const func = evaluate(expression.caller, env);

  if(func.type !== "nativeFunction") {
    throw "Cannot call value that is not a function: " + JSON.stringify(func);
  }

  const result = (func as NativeFunctionValue).call(args, env);

  return result;
}