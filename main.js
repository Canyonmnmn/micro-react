/*
 * @Description: 
 * @Author: jianguo
 * @Date: 2023-01-30 20:49:56
 * @LastEditors: jianguo
 * @LastEditTime: 2023-01-30 21:21:46
 */
import { creareElement } from "./micro-react";

const element = creareElement(
  "h1",
  { id:" title ",class:"hello" },
  "Hello Mirco-react",
  creareElement("h2")
)
console.log(element);