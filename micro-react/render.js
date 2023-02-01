
function createDOM(fiber) {
    //创建元素
    const dom = 
        fiber.type === "TEXT_ELEMENT" 
        ? document.createTextNode("") 
        : document.createElement(fiber.type)
    //附加属性
    Object.keys(fiber.props)
        .filter(key => key !== "children")
            .map(name => dom[name] = fiber.props[name])
    //递归创建并渲染子节点（ 要渲染的子节点过多的话 会堵塞其他线程 故用调度函数进行渲染）
    // fiber.props.children.map(child => render(child,dom))
    
    return dom
}

function render(element,container){
    wipRoot = {
        dom:container,
        props:{
            children:[element]
        }
    }
    nextUnitOfWork = wipRoot
}
function commitRoot(){
    commitWrok( wipRoot.child )
    wipRoot = null
}
function commitWrok(fiber){
    if( !fiber ){
        return 
    }
    const domParent = fiber.parent.dom
    domParent.appendChild( fiber.dom )
    commitWrok( fiber.child )
    commitWrok( fiber.slibing )
}
let nextUnitOfWork = null
let wipRoot = null
//调度函数 —— 空闲时进行渲染
function workLoop(deadline){
    //根据requestIdleCallback返回的deadline时间 确定是否允许渲染 默认为false
    let shouldYield = false
    //当存在渲染任务且有时间进行渲染时
    while( nextUnitOfWork && !shouldYield ){
        //performUnitOfWork 渲染传入任务并返回下一个渲染任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

        shouldYield = deadline.timeRemaining() < 1
    }
    //没有下一个任务了 且具有初始渲染值 commit阶段
    if( !nextUnitOfWork && wipRoot ){
        commitRoot()
    }
    //如果未进行渲染 继续请求渲染 
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork( fiber ){
    //创建DOM元素
    if( !fiber.dom ){
        fiber.dom = createDOM( fiber )
    }
    //如果有父节点就追加到父节点下————（渲染会被打断 用户可能会在浏览器上看到不完整的UI 故不在render执行）
    // if( fiber.parent ){
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }
    //给children新建fiber
    let elements = fiber.props.children
    let index = 0
    let perSlibing = null

    while( index < elements.length ){
        const element = elements[index]
        
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
            child: null,
            slibing: null
        }
        //fiber只有一个child dom 剩余的是其上一个节点的slibing dom
        if( index === 0){
            fiber.child = newFiber
        }else{
            perSlibing.slibing = newFiber
        }
        perSlibing = newFiber
        index ++
    }
    //到这为止 完成当前任务了 并且要返回下一个任务
    if( fiber.child ){
        return fiber.child
    }
    let nextFiber = fiber
    while( nextFiber ){
        if( nextFiber.slibing ){
            return nextFiber.slibing
        }
        nextFiber = nextFiber.parent
    }

}

export default render