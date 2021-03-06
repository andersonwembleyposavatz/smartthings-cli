import { App, AppSettings } from '@smartthings/core-sdk'

import { APICommand, outputItem, outputListing, selectFromList, stringTranslateToId, TableGenerator } from '@smartthings/cli-lib'


export function buildTableOutput(tableGenerator: TableGenerator, appSettings: AppSettings): string {
	if (!appSettings.settings || Object.keys(appSettings.settings).length === 0) {
		return 'No application settings.'
	}

	const table = tableGenerator.newOutputTable({ head: ['Key', 'Value'] })
	if (appSettings.settings) {
		for (const key of Object.keys(appSettings.settings)) {
			table.push([key, appSettings.settings[key]])
		}
	}
	return table.toString()
}

export default class AppSettingsCommand extends APICommand {
	static description = 'get OAuth settings of the app'

	static flags = {
		...APICommand.flags,
		...outputListing.flags,
	}

	static args = [{
		name: 'id',
		description: 'the app id',
	}]

	async run(): Promise<void> {
		const { args, argv, flags } = this.parse(AppSettingsCommand)
		await super.setup(args, argv, flags)

		const config = {
			primaryKeyName: 'appId',
			sortKeyName: 'displayName',
		}
		const listApps = (): Promise<App[]> => this.client.apps.list()

		const preselectedId = await stringTranslateToId(config, args.id, listApps)
		const id = await selectFromList(this, config, preselectedId, listApps, 'Select an app.')
		await outputItem(this,
			{ buildTableOutput: data => buildTableOutput(this.tableGenerator, data) },
			() => this.client.apps.getSettings(id))
	}
}
