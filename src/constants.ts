import type { MacroRunnerSettings } from './types'

export const DEFAULT_SETTINGS: MacroRunnerSettings = {
	macros: [
		{
			id: 'macro-1',
			name: 'My First Macro',
			delay: 150,
			commands: [],
		},
	],
}

export const COMMAND_DELAY_MIN = 0
export const COMMAND_DELAY_MAX = 2000
export const COMMAND_SUGGESTIONS_LIMIT = 50
