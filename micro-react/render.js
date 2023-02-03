
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

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot
    }
    deletions = []
    nextUnitOfWork = wipRoot
}
function commitRoot() {
    deletions.map(commitWrok)
    commitWrok(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function updateDOM(dom, prevProps, nextProps) {
    // 删除老props
    Object.keys( prevProps )
    .filter(key => key!=="children")
    .filter(key =>!(key in nextProps))
    .forEach(key => 
        dom[key] = ""
    )
    //删除旧事件
    Object.keys( prevProps )
    .filter(key=>key.startsWith("on"))
    .filter(key => !(key in nextProps) || prevProps[key]!==nextProps[key])
    .forEach(key=>{
        const eventName = key.toLowerCase().substring(2) 
        dom.removeEventListener( 
            eventName,
            prevProps[key]
        )
    })
    //添加新事件
    Object.keys( nextProps )
    .filter(key =>key.startsWith("on"))
    .filter(key => prevProps[key] !== nextProps[key])
    .forEach(key =>{
        const eventName = key.toLowerCase().substring(2)
        dom.addEventListener(
            eventName,
            nextProps[key]
        )
    })
    //添加新props
    Object.keys( nextProps )
    .filter(key => key!=="children")
    .filter(key => !(key in prevProps) || prevProps[key]!==nextProps[key])
    .forEach(key =>
        dom[key] = nextProps[key]
    )
}
function commitWrok(fiber) {
    if (!fiber) {
        return
    }
    const domParent = fiber.parent.dom
    if( fiber.effectTag == "PLACEMENT" && fiber.dom !== null){
        domParent.appendChild(fiber.dom)
    }else if( fiber.effectTag == "DELETION"){
        domParent.removeChild(fiber.dom)
    }else if( fiber.effectTag == "UPDATE" && fiber.dom !== null){
        updateDOM(
            fiber.dom,
            fiber.alternate.props,
            fiber.props
        )
    }
    commitWrok(fiber.child)
    commitWrok(fiber.sibling)
}
let nextUnitOfWork = null
let currentRoot = null
let wipRoot = null
let deletions = null

//调度函数 —— 空闲时进行渲染
function workLoop(deadline) {
    //根据requestIdleCallback返回的deadline时间 确定是否允许渲染 默认为false
    let shouldYield = false
    //当存在渲染任务且有时间进行渲染时
    while (nextUnitOfWork && !shouldYield) {
        //performUnitOfWork 渲染传入任务并返回下一个渲染任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

        shouldYield = deadline.timeRemaining() < 1
    }
    //没有下一个任务了 且具有初始渲染值 commit阶段
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    //如果未进行渲染 继续请求渲染 
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    //创建DOM元素
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }
    //给children新建fiber
    let elements = fiber.props.children
    reconcileChildren(fiber, elements)
    //到这为止 完成当前任务了 并且要返回下一个任务
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }

}
//调和新旧节点
function reconcileChildren(wipFiber, elements) {
    let index = 0
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    let perSibling = null

    while (index < elements.length || oldFiber ) {
        const element = elements[index]
        const sameType = oldFiber && element && element.type === oldFiber.type
        let newFiber = null;

        //相同节点（属性值可能改变）
        if( sameType ){
            newFiber = {
                type:oldFiber.type,
                props:element.props,
                parent:wipFiber,
                dom:oldFiber.dom,
                alternate:oldFiber,
                effectTag: "UPDATE",
            }
        }
        //新节点
        if( element && !sameType ){
            newFiber = {
                type:element.type,
                props:element.props,
                parent:wipFiber,
                dom:null,
                alternate:null,
                effectTag: "PLACEMENT",
            }
        }
        //删除的节点
        if( oldFiber && !sameType ){
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }
        if( oldFiber ){
            oldFiber = oldFiber.sibling
        }

        //fiber只有一个child dom 剩余的是其上一个节点的sibling dom
        if (index == 0) {
            wipFiber.child = newFiber
        } else {
            perSibling.sibling = newFiber
        }
        perSibling = newFiber
        index++
    }
}

export default render