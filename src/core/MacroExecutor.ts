import type { App } from 'obsidian'
import type { MacroConfig } from '../types'
import { BUILT_IN_ACTION_MAP } from './BuiltInActions'

interface AppWithCommands extends App {
	commands: {
		commands: Record<string, { id: string; name: string }>
		executeCommandById: (id: string) => boolean
	}
}

export class MacroExecutor {
	private app: AppWithCommands

	constructor(app: App) {
		this.app = app as AppWithCommands
	}

	async run(macro: MacroConfig): Promise<void> {
		for (const step of macro.commands) {
			await this.executeOne(step.commandId)
			const delay = step.delay ?? macro.delay
			await this.sleep(delay)
		}
	}

	private async executeOne(cmdId: string): Promise<void> {
		const builtIn = BUILT_IN_ACTION_MAP.get(cmdId)
		if (builtIn) {
			await builtIn.run(this.app)
			return
		}

		const executed = this.app.commands.executeCommandById(cmdId)
		if (!executed) {
			console.warn(`[Macro Runner] Command not found or not executable: ${cmdId}`)
		}
	}

	getAllCommands(): { id: string; name: string }[] {
		return Object.values(this.app.commands.commands)
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}
