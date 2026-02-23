"use client";

import { useState } from "react";

import { ApplicationSettings } from "@/components/mini-ui/application-settings";

import TriggerForm, { Props } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/trigger-form";

export default function Page() {
	const [variant, setVariant] = useState<NonNullable<Props["variant"]>>("default");

	return (
		<>
			<div className="pb-8">
				<TriggerForm variant={variant} />
			</div>
			<ApplicationSettings
				controls={[
					{
						id: "variant",
						label: "Variant",
						onChange: (value) => setVariant(value as NonNullable<Props["variant"]>),
						options: [
							{ label: "Default", value: "default" },
							{ label: "Inline", value: "inline" },
						],
						type: "select",
						value: variant,
					},
				]}
			/>
		</>
	);
}
