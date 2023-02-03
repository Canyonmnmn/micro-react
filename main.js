/*
 * @Description: 
 * @Author: jianguo
 * @Date: 2023-01-30 20:49:56
 * @LastEditors: jianguo
 * @LastEditTime: 2023-02-03 11:12:34
 */
import { createElement,render } from "./micro-react";


const container = document.querySelector("#root")

function handleInput(e){
  renderer(e.target.value)
}
function renderer(value){
  const element = createElement(
  "div",
  null,
  createElement("input",{ oninput:(e)=>handleInput(e) },null),
  createElement("h1",null,value)
)
  render(element,container)
}
renderer("hello")