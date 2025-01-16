export type Container = Element
export type Instance = Element

export const createInstance = (type: string, _props: any): Instance => {
	const element = document.createElement(type)
	// TODO 处理props
	if (__DEV__) {
		console.info('createInstance: props: ', _props)
	}
	// updateFiberProps(element, props)
	return element
}

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child)
}

export const createTextInstance = (content: string) => {
	return document.createTextNode(content)
}

export const appendChildToContainer = appendInitialChild
