/*
 * @Description: 
 * @Author: jianguo
 * @Date: 2023-01-30 20:49:56
 * @LastEditors: jianguo
 * @LastEditTime: 2023-02-06 11:15:19
 */
import { createElement,render,useState } from "./micro-react";


function App(props){
  return createElement("h1",null,"hi",props.name)
}
const container = document.getElementById("root")

const Counter = () => {
  const [state, setState] = useState(0);
  return createElement(
    'h1',
    { onclick: () => setState((prev) => prev + 1) },
    state
  );
};

const element = createElement(Counter);
render(element,container)