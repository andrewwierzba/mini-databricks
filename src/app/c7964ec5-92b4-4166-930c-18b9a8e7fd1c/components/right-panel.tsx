"use client";

import { AlertsSection } from "./alerts-section";
import { DataQualitySection } from "./data-quality-section";
import { JobDetailsSection } from "./job-details-section";
import { JobParametersSection } from "./job-parameters-section";
import { PerformanceMetricsSection } from "./performance-metrics-section";
import { RunHistorySection } from "./run-history-section";
import { SchedulesTriggersSection } from "./schedules-triggers-section";
import { TagsSection } from "./tags-section";

export function RightPanel() {
	return (
		<div className="bg-white border-gray-200 border-l flex flex-col h-full overflow-y-auto w-[360px]">
			<JobDetailsSection />
			<SchedulesTriggersSection />
			<RunHistorySection />
			<PerformanceMetricsSection />
			<DataQualitySection />
			<AlertsSection />
			<JobParametersSection />
			<TagsSection />
		</div>
	);
}
