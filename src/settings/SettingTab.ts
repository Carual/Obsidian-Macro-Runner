import { App, PluginSettingTab, Setting } from 'obsidian'
import type MacroRunnerPlugin from '../main'
import { CommandPickerModal } from '../modals/CommandPickerModal'
import { COMMAND_DELAY_MAX, COMMAND_DELAY_MIN } from '../constants'

export class MacroRunnerSettingTab extends PluginSettingTab {
	private plugin: MacroRunnerPlugin

	constructor(app: App, plugin: MacroRunnerPlugin) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this
		containerEl.empty()

		containerEl.createEl('h2', { text: 'Macro Runner' })
		containerEl.createEl('p', {
			text: 'Each macro is registered as an Obsidian command. Assign it a hotkey under Settings → Hotkeys. Newly created macros appear in Hotkeys after restarting Obsidian.',
			cls: 'setting-item-description',
		})

		const { macros } = this.plugin.settings

		macros.forEach((macro, macroIndex) => {
			const card = containerEl.createEl('div')
			card.style.cssText = 'border:1px solid var(--background-modifier-border);border-radius:8px;padding:16px;margin-bottom:20px;'

			// Macro name
			new Setting(card)
				.setName('Macro name')
				.setDesc('Shown in the Command Palette and Hotkeys settings')
				.addText(text =>
					text.setValue(macro.name).onChange(async val => {
						macro.name = val.trim() || 'Unnamed macro'
						await this.plugin.saveSettings()
					}),
				)
				.addButton(btn =>
					btn
						.setButtonText('Delete')
						.setWarning()
						.onClick(async () => {
							macros.splice(macroIndex, 1)
							await this.plugin.saveSettings()
							this.display()
						}),
				)

			// Global delay
			new Setting(card)
				.setName('Global step delay (ms)')
				.setDesc(
					`Default delay applied after every step. Range: ${COMMAND_DELAY_MIN} to ${COMMAND_DELAY_MAX} ms. Individual steps can override this.`,
				)
				.addText(text =>
					text.setValue(String(macro.delay)).onChange(async val => {
						const parsed = parseInt(val, 10)
						if (!isNaN(parsed)) {
							macro.delay = Math.min(COMMAND_DELAY_MAX, Math.max(COMMAND_DELAY_MIN, parsed))
							await this.plugin.saveSettings()
							this.display()
						}
					}),
				)

			// Steps list
			card.createEl('h4', { text: 'Steps' })

			if (macro.commands.length === 0) {
				card.createEl('p', {
					text: 'No steps yet. Add one below.',
					cls: 'setting-item-description',
				})
			}

			macro.commands.forEach((step, stepIndex) => {
				const appWithCommands = this.app as App & {
					commands: { commands: Record<string, { name: string }> }
				}

				const found = appWithCommands.commands.commands[step.commandId]
				const isBuiltIn = step.commandId.startsWith('macro-runner:')
				const label = found ? found.name : `${step.commandId} (not found)`
				const effectiveDelay = step.delay ?? macro.delay

				const stepSetting = new Setting(card).setName(`${stepIndex + 1}. ${label}`).setDesc(isBuiltIn ? 'Native Macro Runner action' : step.commandId)

				// Per-step delay input
				stepSetting.addText(text => {
					text
						.setPlaceholder(`Global (${macro.delay} ms)`)
						.setValue(step.delay !== undefined ? String(step.delay) : '')
						.onChange(async val => {
							if (val.trim() === '') {
								delete step.delay
							} else {
								const parsed = parseInt(val, 10)
								if (!isNaN(parsed)) {
									step.delay = Math.min(COMMAND_DELAY_MAX, Math.max(COMMAND_DELAY_MIN, parsed))
								}
							}
							await this.plugin.saveSettings()
						})

					text.inputEl.style.width = '80px'
					text.inputEl.title = `Effective delay: ${effectiveDelay} ms`

					if (step.delay !== undefined) {
						text.inputEl.style.borderColor = 'var(--color-accent)'
					}
				})

				stepSetting
					.addExtraButton(btn =>
						btn
							.setIcon('arrow-up')
							.setTooltip('Move up')
							.onClick(async () => {
								if (stepIndex > 0) {
									const prev = macro.commands[stepIndex - 1]!
									const curr = macro.commands[stepIndex]!
									macro.commands[stepIndex - 1] = curr
									macro.commands[stepIndex] = prev
									await this.plugin.saveSettings()
									this.display()
								}
							}),
					)
					.addExtraButton(btn =>
						btn
							.setIcon('arrow-down')
							.setTooltip('Move down')
							.onClick(async () => {
								if (stepIndex < macro.commands.length - 1) {
									const next = macro.commands[stepIndex + 1]!
									const curr = macro.commands[stepIndex]!
									macro.commands[stepIndex + 1] = curr
									macro.commands[stepIndex] = next
									await this.plugin.saveSettings()
									this.display()
								}
							}),
					)
					.addExtraButton(btn =>
						btn
							.setIcon('trash')
							.setTooltip('Delete step')
							.onClick(async () => {
								macro.commands.splice(stepIndex, 1)
								await this.plugin.saveSettings()
								this.display()
							}),
					)
			})

			// Add step button
			new Setting(card).addButton(btn =>
				btn
					.setButtonText('+ Add step')
					.setCta()
					.onClick(() => {
						new CommandPickerModal(this.app, async cmd => {
							macro.commands.push({ commandId: cmd.id })
							await this.plugin.saveSettings()
							this.display()
						}).open()
					}),
			)
		})

		// Add macro button
		new Setting(containerEl).addButton(btn =>
			btn
				.setButtonText('+ New macro')
				.setCta()
				.onClick(async () => {
					macros.push({
						id: `macro-${Date.now()}`,
						name: 'New macro',
						delay: 150,
						commands: [],
					})
					await this.plugin.saveSettings()
					this.display()
				}),
		)
	}
}
