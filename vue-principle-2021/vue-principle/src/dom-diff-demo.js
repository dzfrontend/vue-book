/**
 * vdom diff demo
 */
import { compileToFunctions } from "./compiler/index.js";
import { createElm, patch } from "./vdom/patch.js";

const domDiffTest = (Vue) => {

  // 老的vdom
  let oldTemplate = `<div a="1" style="color: red;">
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
    <li key="D">D</li>
  </div>`;

  let vm1 = new Vue({ data: { message: 'hello world'} });

  const render1 = compileToFunctions(oldTemplate);
  const oldVnode = render1.call(vm1);
  document.body.appendChild(createElm(oldVnode));

  // 新的vdom
  let newTemplate = `<div style="color:blue;">
    <li key="A">A</li>
    <li key="B">B</li>
    <li key="C">C</li>
  </div>`;

  let vm2 = new Vue({ data: { message: 'hello world update'} });

  const render2 = compileToFunctions(newTemplate);
  const newVnode = render2.call(vm2);

  // console.log(oldVnode, newVnode);
  
  // 触发vdom diff
  setTimeout(() => {
    patch(oldVnode, newVnode);
  }, 1000);
  
}

export { domDiffTest }