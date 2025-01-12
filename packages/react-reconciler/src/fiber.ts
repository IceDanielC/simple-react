import { Key, Props } from 'shared/ReactTypes'
import { WorkTag } from './workTags'
import { Flags, NoFlags } from './fiberFlags'
import { Container } from 'hostConfig'

export class FiberNode {
	tag: WorkTag
	key: Key
	type: any
	stateNode: any
	return: FiberNode | null
	child: FiberNode | null
	sibling: FiberNode | null
	index: number
	ref: any
	pendingProps: Props
	memoizedProps: Props | null
	memoizedState: any

	alternate: FiberNode | null
	flags: Flags
	updateQueue: unknown

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag
		this.key = key
		this.type = null
		// stateNode 就是fiber对应的DOM节点，比如hostComponent对应的就是div的实例 -> div Dom
		this.stateNode = null
		this.ref = null

		// 构成树状结构
		this.return = null
		this.child = null
		this.sibling = null
		this.index = 0

		// 作为工作单元
		this.pendingProps = pendingProps
		// 工作完成后确定下来的确定的props
		this.memoizedProps = null
		this.memoizedState = null
		this.updateQueue = null

		this.alternate = null
		// 副作用
		this.flags = NoFlags
	}
}

// fiber树的根节点
export class FiberRootNode {
	// 不同的宿主环境，container的类型不同，可能是DOM
	container: Container
	current: FiberNode
	finishedWork: FiberNode | null

	constructor(container: Element, hostRootFiber: FiberNode) {
		this.container = container
		this.current = hostRootFiber
		hostRootFiber.stateNode = this
		this.finishedWork = null
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate
	if (wip === null) {
		// 首屏渲染时
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key)
		wip.stateNode = current.stateNode
		wip.alternate = current
		current.alternate = wip
	} else {
		// update
		wip.pendingProps = pendingProps
		wip.flags = NoFlags
	}
	wip.type = current.type
	wip.updateQueue = current.updateQueue
	wip.child = current.child
	wip.memoizedProps = current.memoizedProps
	wip.memoizedState = current.memoizedState
	wip.ref = current.ref
	return wip
}
