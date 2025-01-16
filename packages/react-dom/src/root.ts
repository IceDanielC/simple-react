// ReactDOM.createRoot(rootElement).render(<App />)

import { ReactElementType } from 'shared/ReactTypes'
import { Container } from './hostConfig'
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler'

export const createRoot = (container: Container) => {
	const root = createContainer(container)

	return {
		render(element: ReactElementType) {
			return updateContainer(element, root)
		}
	}
}
