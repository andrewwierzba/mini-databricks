"use client";

import { useMemo, useState } from "react";

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
} from "@/components/ui/combobox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Complete list of IANA time zones from the tz database
const IANA_TIME_ZONES = [
	// Africa
	"Africa/Abidjan",
	"Africa/Algiers",
	"Africa/Bissau",
	"Africa/Cairo",
	"Africa/Casablanca",
	"Africa/Ceuta",
	"Africa/El_Aaiun",
	"Africa/Johannesburg",
	"Africa/Juba",
	"Africa/Khartoum",
	"Africa/Lagos",
	"Africa/Maputo",
	"Africa/Monrovia",
	"Africa/Nairobi",
	"Africa/Ndjamena",
	"Africa/Sao_Tome",
	"Africa/Tripoli",
	"Africa/Tunis",
	"Africa/Windhoek",
	// America
	"America/Adak",
	"America/Anchorage",
	"America/Araguaina",
	"America/Argentina/Buenos_Aires",
	"America/Argentina/Catamarca",
	"America/Argentina/Cordoba",
	"America/Argentina/Jujuy",
	"America/Argentina/La_Rioja",
	"America/Argentina/Mendoza",
	"America/Argentina/Rio_Gallegos",
	"America/Argentina/Salta",
	"America/Argentina/San_Juan",
	"America/Argentina/San_Luis",
	"America/Argentina/Tucuman",
	"America/Argentina/Ushuaia",
	"America/Asuncion",
	"America/Bahia",
	"America/Bahia_Banderas",
	"America/Barbados",
	"America/Belem",
	"America/Belize",
	"America/Boa_Vista",
	"America/Bogota",
	"America/Boise",
	"America/Cambridge_Bay",
	"America/Campo_Grande",
	"America/Cancun",
	"America/Caracas",
	"America/Cayenne",
	"America/Chicago",
	"America/Chihuahua",
	"America/Ciudad_Juarez",
	"America/Costa_Rica",
	"America/Coyhaique",
	"America/Cuiaba",
	"America/Danmarkshavn",
	"America/Dawson",
	"America/Dawson_Creek",
	"America/Denver",
	"America/Detroit",
	"America/Edmonton",
	"America/Eirunepe",
	"America/El_Salvador",
	"America/Fort_Nelson",
	"America/Fortaleza",
	"America/Glace_Bay",
	"America/Goose_Bay",
	"America/Grand_Turk",
	"America/Guatemala",
	"America/Guayaquil",
	"America/Guyana",
	"America/Halifax",
	"America/Havana",
	"America/Hermosillo",
	"America/Indiana/Indianapolis",
	"America/Indiana/Knox",
	"America/Indiana/Marengo",
	"America/Indiana/Petersburg",
	"America/Indiana/Tell_City",
	"America/Indiana/Vevay",
	"America/Indiana/Vincennes",
	"America/Indiana/Winamac",
	"America/Inuvik",
	"America/Iqaluit",
	"America/Jamaica",
	"America/Juneau",
	"America/Kentucky/Louisville",
	"America/Kentucky/Monticello",
	"America/La_Paz",
	"America/Lima",
	"America/Los_Angeles",
	"America/Maceio",
	"America/Managua",
	"America/Manaus",
	"America/Martinique",
	"America/Matamoros",
	"America/Mazatlan",
	"America/Menominee",
	"America/Merida",
	"America/Metlakatla",
	"America/Mexico_City",
	"America/Miquelon",
	"America/Moncton",
	"America/Monterrey",
	"America/Montevideo",
	"America/New_York",
	"America/Nome",
	"America/Noronha",
	"America/North_Dakota/Beulah",
	"America/North_Dakota/Center",
	"America/North_Dakota/New_Salem",
	"America/Nuuk",
	"America/Ojinaga",
	"America/Panama",
	"America/Paramaribo",
	"America/Phoenix",
	"America/Port-au-Prince",
	"America/Porto_Velho",
	"America/Puerto_Rico",
	"America/Punta_Arenas",
	"America/Rankin_Inlet",
	"America/Recife",
	"America/Regina",
	"America/Resolute",
	"America/Rio_Branco",
	"America/Santarem",
	"America/Santiago",
	"America/Santo_Domingo",
	"America/Sao_Paulo",
	"America/Scoresbysund",
	"America/Sitka",
	"America/St_Johns",
	"America/Swift_Current",
	"America/Tegucigalpa",
	"America/Thule",
	"America/Tijuana",
	"America/Toronto",
	"America/Vancouver",
	"America/Whitehorse",
	"America/Winnipeg",
	"America/Yakutat",
	// Antarctica
	"Antarctica/Casey",
	"Antarctica/Davis",
	"Antarctica/Macquarie",
	"Antarctica/Mawson",
	"Antarctica/Palmer",
	"Antarctica/Rothera",
	"Antarctica/Troll",
	"Antarctica/Vostok",
	// Asia
	"Asia/Almaty",
	"Asia/Amman",
	"Asia/Anadyr",
	"Asia/Aqtau",
	"Asia/Aqtobe",
	"Asia/Ashgabat",
	"Asia/Atyrau",
	"Asia/Baghdad",
	"Asia/Baku",
	"Asia/Bangkok",
	"Asia/Barnaul",
	"Asia/Beirut",
	"Asia/Bishkek",
	"Asia/Chita",
	"Asia/Colombo",
	"Asia/Damascus",
	"Asia/Dhaka",
	"Asia/Dili",
	"Asia/Dubai",
	"Asia/Dushanbe",
	"Asia/Famagusta",
	"Asia/Gaza",
	"Asia/Hebron",
	"Asia/Ho_Chi_Minh",
	"Asia/Hong_Kong",
	"Asia/Hovd",
	"Asia/Irkutsk",
	"Asia/Jakarta",
	"Asia/Jayapura",
	"Asia/Jerusalem",
	"Asia/Kabul",
	"Asia/Kamchatka",
	"Asia/Karachi",
	"Asia/Kathmandu",
	"Asia/Khandyga",
	"Asia/Kolkata",
	"Asia/Krasnoyarsk",
	"Asia/Kuching",
	"Asia/Macau",
	"Asia/Magadan",
	"Asia/Makassar",
	"Asia/Manila",
	"Asia/Nicosia",
	"Asia/Novokuznetsk",
	"Asia/Novosibirsk",
	"Asia/Omsk",
	"Asia/Oral",
	"Asia/Pontianak",
	"Asia/Pyongyang",
	"Asia/Qatar",
	"Asia/Qostanay",
	"Asia/Qyzylorda",
	"Asia/Riyadh",
	"Asia/Sakhalin",
	"Asia/Samarkand",
	"Asia/Seoul",
	"Asia/Shanghai",
	"Asia/Singapore",
	"Asia/Srednekolymsk",
	"Asia/Taipei",
	"Asia/Tashkent",
	"Asia/Tbilisi",
	"Asia/Tehran",
	"Asia/Thimphu",
	"Asia/Tokyo",
	"Asia/Tomsk",
	"Asia/Ulaanbaatar",
	"Asia/Urumqi",
	"Asia/Ust-Nera",
	"Asia/Vladivostok",
	"Asia/Yakutsk",
	"Asia/Yangon",
	"Asia/Yekaterinburg",
	"Asia/Yerevan",
	// Atlantic
	"Atlantic/Azores",
	"Atlantic/Bermuda",
	"Atlantic/Canary",
	"Atlantic/Cape_Verde",
	"Atlantic/Faroe",
	"Atlantic/Madeira",
	"Atlantic/South_Georgia",
	"Atlantic/Stanley",
	// Australia
	"Australia/Adelaide",
	"Australia/Brisbane",
	"Australia/Broken_Hill",
	"Australia/Darwin",
	"Australia/Eucla",
	"Australia/Hobart",
	"Australia/Lindeman",
	"Australia/Lord_Howe",
	"Australia/Melbourne",
	"Australia/Perth",
	"Australia/Sydney",
	// Europe
	"Europe/Andorra",
	"Europe/Astrakhan",
	"Europe/Athens",
	"Europe/Belgrade",
	"Europe/Berlin",
	"Europe/Brussels",
	"Europe/Bucharest",
	"Europe/Budapest",
	"Europe/Chisinau",
	"Europe/Dublin",
	"Europe/Gibraltar",
	"Europe/Helsinki",
	"Europe/Istanbul",
	"Europe/Kaliningrad",
	"Europe/Kirov",
	"Europe/Kyiv",
	"Europe/Lisbon",
	"Europe/London",
	"Europe/Madrid",
	"Europe/Malta",
	"Europe/Minsk",
	"Europe/Moscow",
	"Europe/Paris",
	"Europe/Prague",
	"Europe/Riga",
	"Europe/Rome",
	"Europe/Samara",
	"Europe/Saratov",
	"Europe/Simferopol",
	"Europe/Sofia",
	"Europe/Tallinn",
	"Europe/Tirane",
	"Europe/Ulyanovsk",
	"Europe/Vienna",
	"Europe/Vilnius",
	"Europe/Volgograd",
	"Europe/Warsaw",
	"Europe/Zurich",
	// Indian
	"Indian/Chagos",
	"Indian/Maldives",
	"Indian/Mauritius",
	// Pacific
	"Pacific/Apia",
	"Pacific/Auckland",
	"Pacific/Bougainville",
	"Pacific/Chatham",
	"Pacific/Easter",
	"Pacific/Efate",
	"Pacific/Fakaofo",
	"Pacific/Fiji",
	"Pacific/Galapagos",
	"Pacific/Gambier",
	"Pacific/Guadalcanal",
	"Pacific/Guam",
	"Pacific/Honolulu",
	"Pacific/Kanton",
	"Pacific/Kiritimati",
	"Pacific/Kosrae",
	"Pacific/Kwajalein",
	"Pacific/Marquesas",
	"Pacific/Nauru",
	"Pacific/Niue",
	"Pacific/Norfolk",
	"Pacific/Noumea",
	"Pacific/Pago_Pago",
	"Pacific/Palau",
	"Pacific/Pitcairn",
	"Pacific/Port_Moresby",
	"Pacific/Rarotonga",
	"Pacific/Tahiti",
	"Pacific/Tarawa",
	"Pacific/Tongatapu",
	// Etc/UTC
	"UTC",
];

function getUtcOffset(timeZone: string): string {
	try {
		const now = new Date();
		const formatter = new Intl.DateTimeFormat("en-US", {
			hour12: false,
			hourCycle: "h23",
			timeZone,
			timeZoneName: "shortOffset",
		});

		const parts = formatter.formatToParts(now);
		const offsetPart = parts.find((part) => part.type === "timeZoneName");

		if (offsetPart) {
			const offset = offsetPart.value;
			// Handle "GMT" (UTC+0)
			if (offset === "GMT") return "UTC+00:00";
			// Convert "GMT+5" or "GMT-5:30" to "UTC+05:00" or "UTC-05:30"
			const match = offset.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
			if (match) {
				const sign = match[1];
				const hours = match[2].padStart(2, "0");
				const minutes = match[3] || "00";
				return `UTC${sign}${hours}:${minutes}`;
			}
		}
		return "UTC+00:00";
	} catch {
		return "UTC+00:00";
	}
}

function formatTimeZoneLabel(timeZone: string): string {
	const offset = getUtcOffset(timeZone);
	// Get just the city name from the time zone
	const parts = timeZone.split("/");
	const city = parts[parts.length - 1].replace(/_/g, " ");
	return `(${offset}) ${city}`;
}

function getLocalTimeZone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export interface TimeZoneItem {
	label: string;
	value: string;
}

export function useTimeZones(): TimeZoneItem[] {
	return useMemo(() => {
		const zones = IANA_TIME_ZONES.map((tz) => ({
			label: formatTimeZoneLabel(tz),
			value: tz,
		}));

		// Sort by UTC offset, then by label
		return zones.sort((a, b) => {
			const offsetA = getUtcOffset(a.value);
			const offsetB = getUtcOffset(b.value);
			if (offsetA !== offsetB) {
				// Parse offset for proper sorting
				const parseOffset = (offset: string) => {
					const match = offset.match(/UTC([+-])(\d{2}):(\d{2})/);
					if (!match) return 0;
					const sign = match[1] === "+" ? 1 : -1;
					return sign * (parseInt(match[2]) * 60 + parseInt(match[3]));
				};
				return parseOffset(offsetA) - parseOffset(offsetB);
			}
			return a.label.localeCompare(b.label);
		});
	}, []);
}

interface Props {
	className?: string;
	onChange: (value: string | undefined) => void;
	showLocalLabel?: boolean;
	value: string | undefined;
}

export function TimeZone({ className, onChange, showLocalLabel = true, value }: Props) {
	const localTimeZone = useMemo(() => getLocalTimeZone(), []);
	const localLabel = `Local time (${localTimeZone})`;
	const localFormattedLabel = useMemo(() => formatTimeZoneLabel(localTimeZone), [localTimeZone]);
	const timeZones = useTimeZones();
	const [query, setQuery] = useState("");

	const valueToLabel = useMemo(() => {
		const map = new Map<string, string>();
		map.set(localTimeZone, showLocalLabel ? localLabel : localFormattedLabel);
		timeZones.forEach((tz) => map.set(tz.value, tz.label));
		return map;
	}, [localFormattedLabel, localLabel, localTimeZone, showLocalLabel, timeZones]);

	const lowerQuery = query.toLowerCase();
	const matchesQuery = (text: string) =>
		!query || text.toLowerCase().includes(lowerQuery);

	const showLocal = matchesQuery(localLabel) || matchesQuery(localTimeZone);
	const filteredTimeZones = query
		? timeZones.filter(
				(tz) => matchesQuery(tz.label) || matchesQuery(tz.value),
			)
		: timeZones;
	const isEmpty = !showLocal && filteredTimeZones.length === 0;

	return (
		<div className={className}>
			<Combobox
				filter={null}
				itemToStringLabel={(val: string) => valueToLabel.get(val) ?? val}
				onInputValueChange={setQuery}
				onOpenChange={(open) => {
					if (!open) {
						setQuery("");
					}
				}}
				onValueChange={(selected: string | null) => {
					if (selected === localTimeZone) {
						onChange(undefined);
					} else if (selected) {
						onChange(selected);
					}
				}}
				value={value ?? localTimeZone}
			>
				<div className="relative">
					<ComboboxInput
						className="rounded-sm min-w-0 w-full truncate"
						placeholder="Search time zones"
						showClear={false}
					/>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="bg-neutral-100 cursor-pointer group rounded-[4px] text-neutral-700 text-sm overflow-hidden px-1 absolute top-2 right-8">
								<span className="relative z-1">DST</span>
								<span className="bg-(--du-bois-blue-600)/10 bottom-0 group-hover:block hidden left-0 absolute right-0 top-0" />
							</div>
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							If you select a time zone that observes daylight saving time, an hourly schedule will be skipped or might appear to be delayed by an hour or two when daylight saving time begins or ends. To run at every hour (absolute time), choose UTC.
						</TooltipContent>
					</Tooltip>
				</div>
				<ComboboxContent>
					<ComboboxList>
						{showLocal && (
							<ComboboxGroup>
								<ComboboxLabel>Recommended</ComboboxLabel>
								<ComboboxItem className="rounded-none" value={localTimeZone}>
									<span className="truncate" title={localLabel}>{localLabel}</span>
								</ComboboxItem>
							</ComboboxGroup>
						)}
						{showLocal && filteredTimeZones.length > 0 && (
							<ComboboxSeparator />
						)}
						{filteredTimeZones.length > 0 && (
							<ComboboxGroup>
								<ComboboxLabel>
									Standard time zones
								</ComboboxLabel>
								{filteredTimeZones.map((tz) => (
									<ComboboxItem
										className="rounded-none"
										key={tz.value}
										value={tz.value}
									>
										<span className="truncate" title={tz.label}>{tz.label}</span>
									</ComboboxItem>
								))}
							</ComboboxGroup>
						)}
						{isEmpty && (
							<div className="flex w-full justify-center py-2 text-center text-sm text-muted-foreground">
								No time zones found
							</div>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
		</div>
	);
}
