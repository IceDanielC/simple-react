import { beginWork } from './beginWork'
import { commitMutationEffects } from './commitWork'
import { completeWork } from './completeWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { MutationMask, NoFlags } from './fiberFlags'
import { HostRoot } from './workTags'

let workInProgress: FiberNode | null = null

// 执行初始化
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {})
}

function performUnitOfWork(fiber: FiberNode) {
	const nextFiber = beginWork(fiber)
	fiber.memoizedProps = fiber.pendingProps
	if (nextFiber === null) {
		// 没有子节点，向上归
		completeUnitOfWork(fiber)
	} else {
		workInProgress = nextFiber
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber
	do {
		// 完成当前节点的“归”阶段
		completeWork(node)

		const sibling = node.sibling
		if (sibling !== null) {
			workInProgress = sibling
			// 别着急 complete，先返回，开启兄弟节点的“递”阶段
			return
		}

		// 完成父节点的“归”阶段
		node = node.return
		workInProgress = node
	} while (node !== null)
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

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork
	if (finishedWork === null) {
		return
	}

	if (__DEV__) {
		console.warn('commit阶段开始', finishedWork)
	}

	// 重制
	root.finishedWork = null

	// 判断是否存在3个子阶段需要执行的操作
	const subtreeHasEffect =
		(finishedWork.subtreeFlags & MutationMask) !== NoFlags
	const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

	if (subtreeHasEffect || rootHasEffect) {
		// beforeMutation
		// mutation => Placement
		commitMutationEffects(finishedWork)
		root.current = finishedWork
		// 把 wip fiber树 插入到DOM树中
	} else {
		root.current = finishedWork
		if (__DEV__) {
			console.warn('未找到对应的Mutation')
		}
	}
}
