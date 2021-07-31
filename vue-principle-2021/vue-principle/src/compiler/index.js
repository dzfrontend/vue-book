import { parseHTML } from "./parse";
import { generate } from "./generate";

export function compileToFunctions(template) {
  // console.log(template);
  // 1.将html转换成ast语法树
  let ast = parseHTML(template);
  // console.log(ast);
  // 2.ast语法树转换成render函数形式
  let code = generate(ast);
  console.log(code);
}