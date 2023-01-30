/*
 * @Description: 
 * @Author: jianguo
 * @Date: 2023-01-30 21:03:04
 * @LastEditors: jianguo
 * @LastEditTime: 2023-01-30 21:22:03
 */
export function creareElement(type,props,...children){
    return {
        type,
        props:{
            ...props,
            children:children.map( child => typeof child === "object" ? child : createTextElement(child))
        }
    }
} 

function createTextElement(text){
    return {
        type:"TEXT_ELEMENT",
        props:{
            nodeValue:text,
            children:[]
        }
    }
}