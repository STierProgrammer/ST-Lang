import Environment from "./Connection/environment.ts";
import { evaluate } from "./Connection/interpreter.ts";
import { MAKE_BOOL, MAKE_NULL } from "./Connection/values.ts";
import Parser from "./core/parser.ts";

STShell();

function STShell() {
  const parser = new Parser();
  const env = new Environment();

  env.declareVar("true", MAKE_BOOL(true), true);
  env.declareVar("false", MAKE_BOOL(false), true);
  env.declareVar("null", MAKE_NULL(), true);

  console.log("\n** STShell v0.1 ** \n");

  while (true) {
    const input = prompt("<STShell/> ");

    if (!input || input.includes("exit")) 
      Deno.exit(1);

    const program = parser.produceAST(input);

    const result = evaluate(program, env);

    console.log(result);
  }
}
