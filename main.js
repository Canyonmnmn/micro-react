/*
 * @Description: 
 * @Author: jianguo
 * @Date: 2023-01-30 20:49:56
 * @LastEditors: jianguo
 * @LastEditTime: 2023-02-01 11:48:10
 */
import { createElement,render } from "./micro-react";


const element = createElement(
  "h1",
  { id:"title",class:"hello" },
  "Hello Mirco-react",
  createElement("h2")
)
const container = document.querySelector("#root")
render(element,container)
console.log(element);