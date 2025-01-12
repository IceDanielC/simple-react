import { UpdateAction } from 'shared/ReactTypes'

export interface Update<State> {
	action: UpdateAction<State>
	next: Update<any> | null
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null
	}
	dispatch: (action: UpdateAction<State>) => void
}

export const createUpdate = <State>(
	action: UpdateAction<State>
): Update<State> => {
	return {
		action,
		next: null
	}
}

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
		// dispatch: (action: UpdateAction<State>) => {
		// 	const update = createUpdate(action)
		// 	enqueueUpdate(update, baseQueue)
		// }
	} as UpdateQueue<State>
}

export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	// const pending = updateQueue.shared.pending
	// if (pending === null) {
	// 	update.next = update
	// } else {
	// 	update.next = pending.next
	// 	pending.next = update
	// }
	updateQueue.shared.pending = update
}

// 消费updateQueue，返回memoizedState
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	}
	if (pendingUpdate !== null) {
		// 第一个update
		const first = pendingUpdate.next
		let pending = pendingUpdate.next as Update<any>
		do {
			const action = pending.action
			if (action instanceof Function) {
				// baseState 1 update (x) => 4x -> memoizedState 4
				result.memoizedState = action(baseState)
			} else {
				// baseState 1 update 2 -> memoizedState 2
				result.memoizedState = action
			}
			pending = pending.next as Update<any>
		} while (pending !== first)
	}
	return result
}
