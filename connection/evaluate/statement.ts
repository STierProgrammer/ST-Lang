import Environment from "../environment.ts";
import { Program, VarDeclaration } from "../../core/ast.ts";
import { evaluate } from "../interpreter.ts";
import { MAKE_NULL, RuntimeVal } from "../values.ts";

export function evaluateProgram(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MAKE_NULL();
  
  for (const statement of program.body) {
    lastEvaluated = evaluate(statement, env);
  }
  
  return lastEvaluated;
}

export function evaluateVarDeclaration(declaration: VarDeclaration, env: Environment): RuntimeVal {
  const value = declaration.value ? evaluate(declaration.value, env): MAKE_NULL();

  return env.declareVar(declaration.identifier, value, declaration.constant);
}
