import { App, SuggestModal } from 'obsidian'
import { COMMAND_SUGGESTIONS_LIMIT } from '../constants'
import { BUILT_IN_ACTIONS } from '../core/BuiltInActions'
import type { ObsidianCommand } from '../types'

export class CommandPickerModal extends SuggestModal<ObsidianCommand> {
	private onChoose: (cmd: ObsidianCommand) => void

	constructor(app: App, onChoose: (cmd: ObsidianCommand) => void) {
		super(app)
		this.onChoose = onChoose
		this.setPlaceholder('Search for a command or Macro Runner action...')
	}

	getSuggestions(query: string): ObsidianCommand[] {
		const appWithCommands = this.app as App & {
			commands: { commands: Record<string, ObsidianCommand> }
		}

		const builtIns: ObsidianCommand[] = BUILT_IN_ACTIONS.map(a => ({
			id: a.id,
			name: a.name,
		}))

		const obsidianCmds = Object.values(appWithCommands.commands.commands)
		const all = [...builtIns, ...obsidianCmds]

		if (!query) return all.slice(0, COMMAND_SUGGESTIONS_LIMIT)

		const q = query.toLowerCase()
		return all.filter(cmd => cmd.name.toLowerCase().includes(q)).slice(0, COMMAND_SUGGESTIONS_LIMIT)
	}

	renderSuggestion(cmd: ObsidianCommand, el: HTMLElement): void {
		const isBuiltIn = cmd.id.startsWith('macro-runner:')

		el.createEl('div', { text: cmd.name })
		el.createEl('small', {
			text: isBuiltIn ? 'Native Macro Runner action' : cmd.id,
			cls: 'setting-item-description',
		})

		if (isBuiltIn) {
			el.style.borderLeft = '2px solid var(--color-accent)'
			el.style.paddingLeft = '8px'
		}
	}

	onChooseSuggestion(cmd: ObsidianCommand): void {
		this.onChoose(cmd)
	}
}
