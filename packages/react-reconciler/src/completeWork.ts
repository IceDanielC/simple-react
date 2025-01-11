// 递归中的归阶段
import { FiberNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './workTags'

export const completeWork = (wip: FiberNode) => {
	// 构建离屏DOM树
	const newProps = wip.pendingProps
	const current = wip.alternate
	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// update
				// 1. props是否变化 {onClick: xxx} {onClick: yyy}
				// 2. 变了 {onClick: xxx} {onClick: xxx, style: {color: 'red'}}
				updateHostComponent(wip)
			} else {
				// mount
				// 1. 构建DOM
				// 2. 插入DOM树
				mountHostComponent(wip)
			}
			bubbleProperties(wip)
			return null
		case HostText:
			if (current !== null && wip.stateNode) {
				// update
				updateHostText(wip)
			} else {
				// mount
				// 1. 构建DOM
				// 2. 插入DOM树
				mountHostText(wip)
			}
			bubbleProperties(wip)
			return null
		case HostRoot:
		default:
			if (__DEV__) {
				console.warn('未实现的completeWork')
			}
			break
	}
}
