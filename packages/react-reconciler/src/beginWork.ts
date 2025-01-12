// 递归中的递阶段
import { FiberNode } from './fiber'
import { HostComponent, HostRoot, HostText } from './workTags'

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
			console.warn('未实现的beginWork')
			break
	}
	return null
}
