import { Key, Props } from 'shared/ReactTypes'
import { WorkTag } from './workTags'
import { Flags, NoFlags } from './fiberFlags'

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
	alternate: FiberNode | null
	flags: Flags

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

		this.alternate = null
		// 副作用
		this.flags = NoFlags
	}
}
