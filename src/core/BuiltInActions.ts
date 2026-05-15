import type { App } from 'obsidian'

export interface BuiltInAction {
	id: string
	name: string
	run: (app: App) => Promise<void>
}

export const BUILT_IN_ACTIONS: BuiltInAction[] = [
	{
		id: 'macro-runner:set-source-mode',
		name: '[Macro Runner] Set active leaf → Source mode',
		run: async app => {
			const leaf = app.workspace.getLeaf(false)
			if (!leaf) return
			await leaf.setViewState({
				type: 'markdown',
				state: { ...leaf.getViewState().state, mode: 'source', source: true },
			})
		},
	},
	{
		id: 'macro-runner:set-reading-view',
		name: '[Macro Runner] Set active leaf → Reading view',
		run: async app => {
			const leaf = app.workspace.getLeaf(false)
			if (!leaf) return
			await leaf.setViewState({
				type: 'markdown',
				state: { ...leaf.getViewState().state, mode: 'preview' },
			})
		},
	},
	{
		id: 'macro-runner:set-live-preview',
		name: '[Macro Runner] Set active leaf → Live Preview',
		run: async app => {
			const leaf = app.workspace.getLeaf(false)
			if (!leaf) return
			await leaf.setViewState({
				type: 'markdown',
				state: { ...leaf.getViewState().state, mode: 'source', source: false },
			})
		},
	},
]

export const BUILT_IN_ACTION_MAP = new Map<string, BuiltInAction>(BUILT_IN_ACTIONS.map(a => [a.id, a]))
