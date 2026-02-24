# Content Workflow

How to create and edit content for the Learn-to-Code-Slowly curriculum. Written for AI and human readers.

**Guiding principle:** Teach how systems behave, not how to memorize tools.

**References:** External links live in **resources.md**. Chapters refer by name (e.g. "See MDN: State machine in resources"), not by URL. Update links once in resources.md.

---

## Content Rules

- **Length:** 15–20 min per chapter. **24,000–27,000** meaningful characters. One chapter = one core mental model. Split or tighten if over.
- **Audio-first:** Clear declarative sentences. No rhetorical questions. Avoid dense nesting. Works with text-to-speech. Cross-refer concepts; don’t over-repeat in one chapter.
- **Depth:** Explain what it is, why it exists, what breaks if misunderstood. Understanding over brevity; no shallow vocab dumps.
- **Structure:** Conceptual framing, concrete examples, common failure modes, short takeaway. Phases group concepts; each phase ends with a consolidation chapter.
- **TOC:** TABLE_OF_CONTENTS.md = phases, chapters, filenames only. No long prose there.

---

## Chapter Structure

1. **Title** — `Section X Phase Y · Chapter Z.N: Title`
2. **One-line description** — What the chapter covers and how it connects.
3. **Learning objectives** — Bullet list of outcomes.
4. **Key terms** — `term: short definition` (colons).
5. **Numbered sections** — `## 1) Section Title`, `## 2) …` Full prose; no code blocks in chapter body.
6. **When to use what** (or equivalent) — Practical guidance.
7. **Homestead examples** — Varied; see list below.
8. **What breaks when…** — Misuse or omission.
9. **Checklist** — Short practical list (optional; can be folded into content).
10. **Common pitfalls** — Short list with brief explanations.
11. **Summary** — Short recap.
12. **Next** — Bridge to next chapter (number and title from TABLE_OF_CONTENTS.md).

**Formatting:** `##` for main sections, `###` for subsections. No `---` between sections. No `[Expand: …]` in final content; write in full.

---

## Homestead Example Variety

Use a range of contexts; don’t default to battery/generator only.

- **Power:** Battery, solar, energy per building, split monitoring.
- **Climate:** Freezer (internal/external), coop, barn (pig/cow), garage, outdoor temp/humidity.
- **Animals:** Coop door (time/chicken count), chicken counter, coop/barn monitoring, ESP32-CAM.
- **Garden:** Soil moisture, drip irrigation, garden areas.
- **Infrastructure:** Poultry net voltage/energizer, network/ESP32, Wi‑Fi.
- **Web:** Webcams, Express/Handlebars sites, Pi/Home Assistant, ESP32/MQTT.

Keep examples simple. Realistic scenarios; avoid long “homestead relevance” paragraphs.

---

## Using Resources

1. Check **resources.md** for relevant docs.
2. Fetch and integrate definitions/examples; don’t just link.
3. Cite by name in the chapter (e.g. "See MDN: … in resources"). Direct quotes or close paraphrase: attribute. General concepts: no citation needed.

---

## Code and Projects

- **Code lives in separate files** (e.g. `Phase_X/examples/Chapter_X.Y_example.py` or equivalent). Not in chapter markdown.
- **Chapters** describe code conceptually; reference files by name. Minimal in-text refs (e.g. "(Code examples)") so audio flow isn’t broken.
- **Phase_X_Code_Examples.md** — Index of code by chapter/section; visual reference only, not read aloud. No code blocks inside chapter files.
- **Code:** Runnable, one concept per example, docstrings, homestead/IoT where it fits. Cursor can run and verify.
- **Challenges/projects:** Progressive; marked for hands-on time. Solutions in `solutions/` or equivalent. Not read aloud.

---

## Tightening and Editing

- **Cut filler** — No “Here’s the mental upgrade…”, “You should be able to say…”, or rhetorical questions.
- **Cut these section types** — FAQ, “Review” blocks, long checklists, roadmaps, extended scenarios, “When Things Go Wrong” essays, “Before and After” fluff.
- **Keep** — Learning objectives, key terms, core content, short common pitfalls, short summary, brief next-chapter bridge.
- **Style** — Direct language; fewer nested lists; every sentence earns its place. Over 27k characters → tighten.

---

## Reference

- **TABLE_OF_CONTENTS.md** — Curriculum map, chapter order, next-chapter info.
- **resources.md** — All external links.
- **README.md** — Project overview.
