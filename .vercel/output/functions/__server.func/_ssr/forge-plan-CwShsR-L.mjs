import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { a as heuristicNotes } from "./detect-4ghxlhvC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forge-plan-CwShsR-L.js
function fallbackPlan(analysis) {
	const wide = /dashboard|analytics|admin|editor|ide/i.test(`${analysis.framework} ${analysis.suggestedName} ${analysis.description ?? ""}`);
	return {
		window: {
			width: wide ? 1440 : 1280,
			height: wide ? 900 : 800
		},
		notes: heuristicNotes(analysis),
		caveats: analysis.alreadyDesktop ? ["This project already ships as a desktop app. Kaji will restamp the name and icon."] : []
	};
}
var planForge_createServerFn_handler = createServerRpc({
	id: "90f0238d0981348cc35948c8d1e89788d47bedbb92c75f99f95de535ab261262",
	name: "planForge",
	filename: "src/lib/forge-plan.ts"
}, (opts) => planForge.__executeServer(opts));
var planForge = createServerFn({ method: "POST" }).validator((input) => input).handler(planForge_createServerFn_handler, async ({ data }) => {
	const fallback = fallbackPlan(data.analysis);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return fallback;
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 400,
				temperature: .3,
				messages: [{
					role: "system",
					content: "You are Kaji, a quiet desktop-app forge. Return JSON only: {\"window\":{\"width\":number,\"height\":number},\"notes\":[string],\"caveats\":[string]}. Notes: max 3, short, craftsman voice. Never mention Electron, Tauri, wrappers, or packaging tools. Caveats only if something will actually bite the user."
				}, {
					role: "user",
					content: JSON.stringify({
						name: data.name,
						framework: data.analysis.framework,
						language: data.analysis.language,
						bundler: data.analysis.bundler,
						entry: data.analysis.entry,
						startUrl: data.analysis.startUrl,
						alreadyDesktop: data.analysis.alreadyDesktop,
						features: data.analysis.features,
						description: data.analysis.description
					})
				}]
			}),
			signal: AbortSignal.timeout(12e3)
		});
		if (!res.ok) return fallback;
		const match = ((await res.json()).choices?.[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
		if (!match) return fallback;
		const parsed = JSON.parse(match[0]);
		const width = Number(parsed.window?.width) || fallback.window.width;
		const height = Number(parsed.window?.height) || fallback.window.height;
		const notes = Array.isArray(parsed.notes) ? parsed.notes.map(String).slice(0, 3) : fallback.notes;
		const caveats = Array.isArray(parsed.caveats) ? parsed.caveats.map(String).slice(0, 3) : [];
		return {
			window: {
				width: Math.min(1920, Math.max(800, width)),
				height: Math.min(1200, Math.max(600, height))
			},
			notes: notes.length ? notes : fallback.notes,
			caveats
		};
	} catch {
		return fallback;
	}
});
//#endregion
export { planForge_createServerFn_handler };
