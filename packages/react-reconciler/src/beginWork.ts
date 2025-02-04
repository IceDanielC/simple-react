// 递归中的递阶段
import { ReactElementType } from 'shared/ReactTypes'
import { FiberNode } from './fiber'
import { processUpdateQueue, UpdateQueue } from './updateQueue'
import { HostComponent, HostRoot, HostText } from './workTags'
import { mountChildFibers, reconcileChildFibers } from './childFibers'

export const beginWork = (wip: FiberNode) => {
	// compare，返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip)
		case HostComponent:
			return updateHostComponent(wip)
		case HostText:
			return null
		default:
			if (__DEV__) {
				console.warn('未实现的beginWork')
			}
			break
	}
	return null
}

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState // 初始化时为null
	const updateQueue = wip.updateQueue as UpdateQueue<ReactElementType | Element>
	const pending = updateQueue.shared.pending
	updateQueue.shared.pending = null
	if (pending !== null) {
		const { memoizedState } = processUpdateQueue(baseState, pending)
		wip.memoizedState = memoizedState
	}
	const nextChildren = wip.memoizedState
	reconcileChildren(wip, nextChildren)
	return wip.child
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps
	const nextChildren = nextProps.children
	reconcileChildren(wip, nextChildren)
	return wip.child
}

/**
 * 创建wip的子Fiber
 */
function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate

	if (current !== null) {
		// update
		// 首次渲染过程中，只有 HostRoot 会走到这里
		wip.child = reconcileChildFibers(wip, current?.child, children)
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children)
	}
}
