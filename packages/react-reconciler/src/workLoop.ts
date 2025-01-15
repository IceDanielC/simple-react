import { beginWork } from './beginWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'

let workInProgress: FiberNode | null = null

// 执行初始化
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {})
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber)
	fiber.memoizedProps = fiber.pendingProps
	if (next === null) {
		// 没有子节点，向上归
		completeUnitOfWork(fiber)
	} else {
		workInProgress = next
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber
	let parent = node.return
	while (parent !== null) {
		node = parent
		parent = node.return
	}
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能

	// 拿到fiberRootNode
	const root = markUpdateFromFibertoRoot(fiber)
	// 开始渲染
	renderRoot(root)
}

// 找到传入fiber的fiberRootNode
function markUpdateFromFibertoRoot(fiber: FiberNode) {
	let node = fiber
	let parent = node.return
	while (parent !== null) {
		node.return = parent
		node = parent
		parent = node.return
	}
	if (node.tag === HostRoot) {
		return node.stateNode
	}
	return null
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

function renderRoot(root: FiberRootNode) {
	prepareFreshStack(root)

	do {
		try {
			workLoop()
			break
		} catch (e) {
			if (__DEV__) {
				console.warn('workLoop发生错误', e)
			}
			workInProgress = null
		}
	} while (true)

	// beginWork和completeWork的产物：wip fiber树
	const finishedWork = root.current.alternate
	root.finishedWork = finishedWork

	commitRoot(root)
}
