"use client";

import { JobDetailsSection } from "./job-details-section";
import { JobParametersSection } from "./job-parameters-section";
import { SchedulesTriggersSection } from "./schedules-triggers-section";
import { TagsSection } from "./tags-section";

export function RightPanel() {
	return (
		<div className="bg-white border-gray-200 border-l flex flex-col h-full overflow-y-auto w-[320px]">
			<JobDetailsSection />
			<SchedulesTriggersSection />
			<JobParametersSection />
			<TagsSection />
		</div>
	);
}
