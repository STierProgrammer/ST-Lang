import Parser from "./core/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MAKE_BOOL, MAKE_NULL, MAKE_NUMBER} from "./runtime/values.ts";

repl();

function repl() {
    const parser = new Parser();
    const environment = new Environment();
    
    environment.declareVarbiale("x", MAKE_NUMBER(100));
    environment.declareVarbiale("true", MAKE_BOOL(true));
    environment.declareVarbiale("false", MAKE_BOOL(false));
    environment.declareVarbiale("null", MAKE_NULL());

    console.log("\nRepl v0.1")

    while(true) {
        const input = prompt("> ");

        if(!input || input.includes("exit")) {
            Deno.exit(1);
        }

        const program = parser.produceAST(input);

        console.log(program);

        const result = evaluate(program, environment);
        
        console.log("Result: ", result);
    }
}