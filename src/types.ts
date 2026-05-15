export interface MacroStep {
	commandId: string
	delay?: number // undefined = inherits the macro global delay
}

export interface MacroConfig {
	id: string
	name: string
	delay: number // global default delay for all steps
	commands: MacroStep[]
}

export interface MacroRunnerSettings {
	macros: MacroConfig[]
}

export interface ObsidianCommand {
	id: string
	name: string
	callback?: () => void
}
