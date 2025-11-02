export default function StylesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div style={{ backgroundColor: "#f7f7f4", minHeight: "100vh" }}>
			{children}
		</div>
	);
}
