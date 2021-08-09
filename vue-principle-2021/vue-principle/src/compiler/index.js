import { parseHTML } from "./parse";
import { generate } from "./generate";

export function compileToFunctions(template) {
  // console.log(template);
  // 1.将html转换成ast语法树
  let ast = parseHTML(template);
  console.log(ast);
  // 2.ast语法树转换成render函数字符串
  let code = generate(ast);
  // console.log(code);

  // 3.将render函数字符串转成render函数
  let render = new Function(`with(this){ return ${code} }`); // 使用with将vm传进render函数
  return render;
}