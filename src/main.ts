import { Plugin } from 'obsidian'
import { MacroRunnerSettingTab } from './settings/SettingTab'
import { MacroExecutor } from './core/MacroExecutor'
import { DEFAULT_SETTINGS } from './constants'
import type { MacroConfig, MacroRunnerSettings } from './types'

export default class MacroRunnerPlugin extends Plugin {
	settings!: MacroRunnerSettings
	private executor!: MacroExecutor

	async onload(): Promise<void> {
		await this.loadSettings()

		this.executor = new MacroExecutor(this.app)
		this.registerMacroCommands()
		this.addSettingTab(new MacroRunnerSettingTab(this.app, this))

		console.log('[Macro Runner] Loaded')
	}

	onunload(): void {
		console.log('[Macro Runner] Unloaded')
	}

	private registerMacroCommands(): void {
		for (const macro of this.settings.macros) {
			this.registerMacroCommand(macro)
		}
	}

	private registerMacroCommand(macro: MacroConfig): void {
		this.addCommand({
			id: `run-${macro.id}`,
			name: macro.name,
			callback: () => this.executor.run(macro),
		})
	}

	async loadSettings(): Promise<void> {
		const saved = await this.loadData()

		// Migration from old format where commands was string[]
		if (saved?.macros) {
			saved.macros = saved.macros.map((macro: any) => ({
				...macro,
				commands: macro.commands.map((cmd: any) => (typeof cmd === 'string' ? { commandId: cmd } : cmd)),
			}))
		}

		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved)
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings)
	}
}
