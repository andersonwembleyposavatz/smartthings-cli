import { Location, LocationItem } from '@smartthings/core-sdk'

import { APICommand, outputListing } from '@smartthings/cli-lib'


export const tableFieldDefinitions = [
	'name', 'locationId', 'countryCode', 'timeZoneId', 'backgroundImage',
	'latitude', 'longitude', 'regionRadius', 'temperatureScale', 'locale',
]

export default class LocationsCommand extends APICommand {
	static description = 'get a specific Location'

	static flags = {
		...APICommand.flags,
		...outputListing.flags,
	}

	static args = [{
		name: 'idOrIndex',
		description: 'the location id or number in list',
	}]

	async run(): Promise<void> {
		const { args, argv, flags } = this.parse(LocationsCommand)
		await super.setup(args, argv, flags)

		const config = {
			primaryKeyName: 'locationId',
			sortKeyName: 'name',
			tableFieldDefinitions,
		}
		await outputListing<Location, LocationItem>(this, config, args.idOrIndex,
			() => this.client.locations.list(),
			id => this.client.locations.get(id))
	}
}
