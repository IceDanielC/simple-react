// 递归中的归阶段
import {
	appendInitialChild,
	Container,
	createInstance,
	createTextInstance,
	Instance
} from 'hostConfig'
import { FiberNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './workTags'
import { NoFlags } from './fiberFlags'

export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps
	const current = wip.alternate
	// 构建离屏DOM树
	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// mount
				// 构建DOM
				const instance = createInstance(wip.type, newProps)
				// 将DOM插入到DOM树(instance)中
				appendAllChildren(instance, wip)
				wip.stateNode = instance
			}
			bubbleProperties(wip)
			return null
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
			} else {
				// mount
				// 构建DOM
				const instance = createTextInstance(newProps.content)
				// 将DOM插入到DOM树中
				wip.stateNode = instance
			}
			bubbleProperties(wip)
			return null
		case HostRoot:
			bubbleProperties(wip)
			return null
		default:
			if (__DEV__) {
				console.warn('未实现的completeWork', wip)
			}
			break
	}
	return null
}

function appendAllChildren(parent: Container | Instance, wip: FiberNode) {
	let node = wip.child
	while (node !== null) {
		if (node.tag === HostComponent || node.tag === HostText) {
			appendInitialChild(parent, node.stateNode)
		} else if (node.child !== null) {
			node.child.return = node
			node = node.child
			continue
		}

		if (node === wip) {
			return
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return
			}
			node = node.return
		}

		node.sibling.return = node.return
		node = node.sibling
	}
}

/**
 * 将wip的 child 和 sibling 的 flags 向上收集
 *  */
function bubbleProperties(wip: FiberNode) {
	let subtreeFlags = NoFlags
	let child = wip.child
	while (child !== null) {
		subtreeFlags |= child.subtreeFlags
		subtreeFlags |= child.flags
		child.return = wip
		child = child.sibling
	}
	wip.subtreeFlags |= subtreeFlags
}
