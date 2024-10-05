import { createGlobalEnv } from "./Connection/environment.ts";
import { evaluate } from "./Connection/interpreter.ts";
import Parser from "./core/parser.ts";

run("./test.txt");

async function run(filename: string) {
  const parser = new Parser();
  const env = createGlobalEnv();

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAST(input);
  const result = evaluate(program, env);
}

function STShell() {
  const parser = new Parser();
  const env = createGlobalEnv();

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
