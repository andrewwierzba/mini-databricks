import { Workspace } from "@/components/ui/patterns/file-browser"

export default function Home() {
	return (
		<div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full">
			<Workspace />
			Mini Databricks
		</div>
	);
}
