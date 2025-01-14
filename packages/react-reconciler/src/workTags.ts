// 函数组件
export const FunctionComponent = 0
// 根节点
export const HostRoot = 3
// 原生节点
export const HostComponent = 5
// 文本节点
export const HostText = 6

export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText
