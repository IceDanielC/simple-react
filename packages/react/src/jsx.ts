// ReactElement
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import type {
	Key,
	Ref,
	ElmentType,
	Props,
	ReactElementType,
	Type
} from 'shared/ReactTypes'

const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'Ice'
	}
	return element
}

export const jsx = (type: ElmentType, config: any, ...maybeChildren: any) => {
	let key: Key = null
	const props: Props = {}
	let ref: Ref = null

	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (val !== undefined) {
				key = val + ''
			}
			continue
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val
			}
			continue
		}
		// 把除去key和ref的属性赋值给props
		if (Object.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}
	if (maybeChildren.length) {
		if (maybeChildren.length === 1) {
			props.children = maybeChildren[0]
		} else {
			props.children = maybeChildren
		}
	}
	return ReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElmentType, config: any) => {
	let key: Key = null
	const props: Props = {}
	let ref: Ref = null

	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (val !== undefined) {
				key = val + ''
			}
			continue
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val
			}
			continue
		}
		// 把除去key和ref的属性赋值给props
		if (Object.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}

	return ReactElement(type, key, ref, props)
}
