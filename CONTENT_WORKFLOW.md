# Content Creation and Fine-Tuning Workflow

This document describes how to create, expand, and refine content for the Learn-to-Code-Slowly curriculum. It is shared with both Cursor and ChatGPT so both tools can follow the same approach.

---

## Guiding Principle

**Teach how systems behave, not how to memorize tools.**

---

## Core Principle

**resources.md is the main reference list.** All external documentation links live there. Chapter files refer to resources by name (e.g., "See the MDN State machine entry in resources") rather than repeating URLs. When a link changes, update it once in resources.md.

---

## Content Constraints

These rules apply to all instructional content in this project.

### Chapter Length

- Target ~15 minutes per chapter (read or listen)
- One chapter = one core mental model
- Split topics if they exceed the time or clarity limit

### Audio-First

- Content must work well with text-to-speech
- Use clear declarative sentences
- Intentional repetition is allowed and encouraged
- Avoid dense nesting or reference-heavy writing

### Depth

- Explain what it is, why it exists, and what breaks if misunderstood
- Prefer understanding over brevity
- Avoid shallow summaries or vocabulary dumps

### Structure (per chapter)

- Clear conceptual framing
- Concrete, plain-language examples
- Common failure modes
- A short anchor takeaway

### Phase Organization

- Phases group concepts, not tools
- Each phase ends with a consolidation chapter
- Later phases assume earlier mental models

### Table of Contents

- TABLE_OF_CONTENTS.md lists phases, chapters, and filenames only
- No prose or long explanations in the TOC

### Iteration

- Chapters may be rewritten or expanded
- Preserve filenames when possible
- Expanded content must still respect the ~15-minute target

---

## Using the Resources

Before writing or expanding content:

1. **Check resources.md** for relevant documentation URLs.
2. **Fetch content** from those URLs when expanding a concept (Cursor can use web fetch; ChatGPT can reference its training data or suggest what to look up).
3. **Integrate** definitions, examples, or concepts from the resources—don’t just add links.
4. **Cite by name** in the chapter (e.g., "See MDN: State machine in resources") rather than pasting URLs into every file.

### When to Credit Sources

- **Direct quotes:** Cite the source (e.g., "Source: MDN" or a footnote).
- **Close paraphrasing:** Add attribution.
- **General concepts:** No citation needed.
- **Technical definitions:** Cite the source; it helps learners and is good practice.

---

## Division of Labor: ChatGPT vs. Cursor

### ChatGPT strengths

- Generating long, detailed drafts from scratch
- Brainstorming structures and angles
- Drafting new sections or whole chapters
- Asking clarifying questions to surface assumptions

### Cursor strengths

- **Fetching live content** from resource URLs
- **Editing for consistency** with the existing curriculum voice and structure
- **Cross-referencing** the TABLE_OF_CONTENTS and phase structure
- **Technical accuracy** and alignment with the homestead/IoT context
- **Tightening** — removing filler, fixing structure

### Recommended workflow

1. **First pass (either tool):** Draft or expand content.
2. **Cursor:** Fetch from resources.md URLs, integrate definitions and examples, edit for clarity and correctness.
3. **Optional:** ChatGPT generates additional or alternative sections.
4. **Cursor:** Edit for consistency, remove filler, ensure technical accuracy.

---

## Expanding Existing Content

When adding more detail to a section:

1. **Identify relevant resources** from resources.md (e.g., MDN for web/state concepts, Docker docs for containers).
2. **Fetch and read** the resource content (Cursor) or reference it (ChatGPT).
3. **Expand** with:
   - Deeper definitions
   - More homestead-specific examples
   - Concrete “how to think about this” guidance
   - Brief pointers to where the concept shows up later (e.g., HTTP, SQLite, MQTT)
4. **Keep the voice** — concept-first, audio-friendly, no filler.
5. **Cite by name** — refer to resources.md entries, don’t repeat URLs in chapter files.

---

## Tightening and Editing

When editing for clarity:

- **Remove filler** — Phrases like "Here's the mental upgrade that makes everything click" or "You should be able to say" add no substance. Cut them.
- **Keep the quotes** — The closing anchor quotes at the end of sections stay. They reinforce the core idea.
- **Use headings** — Option B style: numbered `##` for main sections, `###` for subsections. No horizontal rules.
- **Be concise** — Every sentence should earn its place. If it doesn’t add information or reinforcement, remove it.

---

## Chapter Structure

Each chapter file should:

- Use `#` for the document title
- Use `##` for main sections (with optional numbering, e.g., "1) Inputs, State, Outputs")
- Use `###` for subsections
- Include clear conceptual framing, concrete examples, and common failure modes (see Structure under Content Constraints)
- End with a reflection or consolidation section
- Include a short anchor takeaway (e.g., closing quote) when appropriate
- Refer to resources.md for external links

---

## Reference: Key Documents

- **TABLE_OF_CONTENTS.md** — Full curriculum map, phases, chapters, filenames, learning path (no prose in chapter listings)
- **resources.md** — Main reference list; all external documentation links
- **README.md** — Project overview; points to resources.md for references

---

## Summary for AI Assistants

1. **Guiding principle:** Teach how systems behave, not how to memorize tools.
2. **resources.md** = single source of truth for external links. Don’t paste URLs into chapter files.
3. **Content constraints:** ~15 min per chapter, audio-first, one mental model per chapter, include failure modes and anchor takeaways.
4. **Fetch and integrate** from resource URLs when expanding concepts.
5. **ChatGPT** = drafting, brainstorming, long-form generation.
6. **Cursor** = fetching, editing, consistency, technical accuracy, tightening.
7. **Cut filler.** Keep substance. Maintain the concept-first, homestead-grounded voice.
8. **Homestead examples** — Use homestead examples anywhere that is appropriate.