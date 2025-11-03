"use client"

import { useEffect, useMemo, useState } from "react"

import CodeMirror, { Extension, ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { markdown } from "@codemirror/lang-markdown"
import { python } from "@codemirror/lang-python"
import { sql } from "@codemirror/lang-sql"
import { createTheme } from "@uiw/codemirror-themes"
import { tags as t } from "@lezer/highlight"

type SupportedLanguage = "javascript" | "typescript" | "jsx" | "tsx" | "python" | "sql" | "markdown" | "json" | "text"

interface CodeEditorProps extends Omit<ReactCodeMirrorProps, "theme" | "extensions"> {
	filename?: string
	language?: SupportedLanguage
}

const getLanguageExtension = (language: SupportedLanguage): Extension[] => {
	switch (language) {
		case "javascript":
			return [javascript({ jsx: false })]
		case "jsx":
			return [javascript({ jsx: true })]
		case "typescript":
			return [javascript({ typescript: true, jsx: false })]
		case "tsx":
			return [javascript({ typescript: true, jsx: true })]
		case "python":
			return [python()]
		case "sql":
			return [sql()]
		case "markdown":
			return [markdown()]
		case "json":
			return [javascript({ json: true })]
		case "text":
		default:
			return []
	}
}

const detectLanguageFromFilename = (filename: string): SupportedLanguage => {
	const ext = filename.split(".").pop()?.toLowerCase()

	switch (ext) {
		case "js":
			return "javascript"
		case "jsx":
			return "jsx"
		case "ts":
			return "typescript"
		case "tsx":
			return "tsx"
		case "py":
			return "python"
		case "sql":
			return "sql"
		case "md":
			return "markdown"
		case "json":
			return "json"
		default:
			return "text"
	}
}

export function CodeEditor({
	filename,
	language,
	value = "",
	...props
}: CodeEditorProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const detectedLanguage = useMemo(() => {
		if (language) return language
		if (filename) return detectLanguageFromFilename(filename)
		return "text"
	}, [filename, language])

	const extensions = useMemo(() => {
		return getLanguageExtension(detectedLanguage)
	}, [detectedLanguage])

	// Create custom theme using Databricks Design System colors
	const databricksTheme = useMemo(
		() =>
			createTheme({
				dark: "light",
				settings: {
					background: "var(--du-bois-color-background-primary)",
					backgroundImage: "",
					caret: "var(--du-bois-color-text-primary)",
					fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
					foreground: "var(--du-bois-color-text-primary)",
					gutterActiveForeground: "var(--du-bois-color-text-primary)",
					gutterBackground: "var(--du-bois-color-background-primary)",
					gutterBorder: "transparent",
					gutterForeground: "var(--du-bois-color-text-secondary)",
					lineHighlight: "oklch(0 0 0 / 0.03)",
					selection: "oklch(0.8 0.05 250 / 0.3)",
					selectionMatch: "oklch(0.8 0.05 250 / 0.2)",
				},
				styles: [
					{ color: "oklch(0.55 0.15 30)", tag: t.comment },
					{ color: "oklch(0.45 0.20 280)", fontWeight: "bold", tag: t.keyword },
					{ color: "oklch(0.35 0.15 260)", tag: t.name },
					{ color: "oklch(0.40 0.18 260)", tag: t.typeName },
					{ color: "oklch(0.40 0.18 260)", tag: t.className },
					{ color: "oklch(0.40 0.12 200)", tag: t.propertyName },
					{ color: "oklch(0.45 0.18 140)", tag: t.string },
					{ color: "oklch(0.50 0.15 30)", tag: t.number },
					{ color: "oklch(0.50 0.15 30)", tag: t.bool },
					{ color: "oklch(0.50 0.15 30)", tag: t.null },
					{ color: "oklch(0.40 0.12 200)", tag: t.variableName },
					{ color: "oklch(0.35 0.15 260)", tag: t.function(t.variableName) },
					{ color: "oklch(0.30 0.10 250)", tag: t.operator },
					{ color: "oklch(0.30 0.10 250)", tag: t.punctuation },
				],
			}),
		[]
	)

	// Prevent hydration mismatch by not rendering on server
	if (!mounted) {
		return (
			<div
				className="bg-(--du-bois-color-background-primary) flex h-full w-full"
				style={{
					fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
					fontSize: "13px",
				}}
			>
				<div className="p-4 text-(--du-bois-color-text-secondary)">
					Loading editor...
				</div>
			</div>
		)
	}

	return (
		<CodeMirror
			basicSetup={{
				autocompletion: true,
				bracketMatching: true,
				closeBrackets: true,
				foldGutter: true,
				highlightActiveLine: true,
				highlightActiveLineGutter: true,
				highlightSelectionMatches: true,
				indentOnInput: true,
				lineNumbers: true,
				searchKeymap: true,
				syntaxHighlighting: true,
			}}
			extensions={extensions}
			style={{
				flex: 1,
				fontSize: "13px",
				height: "100%",
			}}
			theme={databricksTheme}
			value={value}
			{...props}
		/>
	)
}
