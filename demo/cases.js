// Synthetic public review fixtures. Explicit IDs keep references stable across sorting.
(function (root) {
  const data = {
  "schema_version": "demo-review-1",
  "cases": [
    {
      "id": "baseline",
      "name": "Case A: Self-Written Baseline",
      "short_name": "Correspondence continuity",
      "question": "Which details remain consistent across these replies?",
      "stage": "Personal correspondence",
      "posture": "Baseline-like pattern",
      "overview": "The supplied summaries describe recurring details and direct replies. One excerpt preserves tentative phrasing; that alone establishes neither authorship nor a writing baseline.",
      "reader_intuition": "The correspondent appears to write directly, with light or no tool support.",
      "must_not_conclude": [
        "Use as a reading baseline, not as proof. The point is to map evidence, not to certify authorship.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [],
      "qualified_human_review_required": false,
      "coverage_note": "Medium: three synthetic messages only",
      "limitations": [
        "Synthetic demo data; no real private letter included.",
        "Medium if treated as a universal standard.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "Continuity across replies",
          "description": "Locate the original details behind the summary before relying on consistency.",
          "kind": "claim",
          "id": "CL-A-WORK"
        },
        {
          "title": "Tentative phrasing",
          "description": "Read the local wording and its alternative explanations.",
          "kind": "evidence",
          "id": "EV-A-PHRASING"
        }
      ],
      "sources": [
        {
          "id": "A001",
          "author_role": "Reviewer / context",
          "target_status": "context",
          "date": "2026-04-01",
          "reference": "synthetic:A001",
          "summary": "The reviewer asks about local work, music, and language learning.",
          "tags": [
            "Context only"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "C001",
          "author_role": "Correspondent / target",
          "target_status": "target",
          "date": "2026-04-03",
          "reference": "synthetic:C001",
          "summary": "The correspondent answers directly, gives concrete work details, and asks a specific return question.",
          "tags": [
            "Stable",
            "Direct response",
            "writer/source texture"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "C002",
          "author_role": "Correspondent / target",
          "target_status": "target",
          "date": "2026-04-10",
          "reference": "synthetic:C002",
          "summary": "The second reply reuses earlier details naturally and keeps the same uneven but fluent style.",
          "tags": [
            "Continuity",
            "Stable style"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-A-WORK",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [],
          "action_ids": [
            "ACT-A-CONTINUITY"
          ],
          "text": "Works in a local technical business.",
          "type": "Verifiable background claim",
          "support_status": "First appeared",
          "review_posture": "Stable"
        },
        {
          "id": "CL-A-LANGUAGE",
          "source_ids": [],
          "evidence_ids": [],
          "action_ids": [
            "ACT-A-CONTINUITY"
          ],
          "text": "Learned Japanese for personal reasons.",
          "type": "Self-history claim",
          "support_status": "Repeated with detail",
          "review_posture": "Stable"
        },
        {
          "id": "CL-A-PROCESS",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [
            "EV-A-PHRASING"
          ],
          "action_ids": [
            "ACT-A-PROCESS"
          ],
          "text": "May use grammar checking.",
          "type": "Tool-use possibility",
          "support_status": "Unknown",
          "review_posture": "Ask only if relevant"
        }
      ],
      "evidence": [
        {
          "id": "EV-A-PHRASING",
          "source_ids": [
            "C001"
          ],
          "lane": "Authorship / mediation",
          "texture_axis": "source_texture",
          "action_ids": [
            "ACT-A-PHRASING",
            "ACT-A-PROCESS"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Tentative self-correction",
          "attention": "Local observation",
          "excerpt": "I tried to explain it better, but maybe I make the sentence too long...",
          "marked_text": [
            {
              "text": "maybe I make the sentence too long",
              "label": "Tentative self-comment",
              "reason": "This comments on the writing process; it is not a verified grammar error or proof of human authorship."
            }
          ],
          "observation": "The sentence comments on the writer's attempt to explain and leaves that uncertainty visible.",
          "reasoning_chain": [
            "The local self-comment is the observable cue.",
            "An editor or AI could preserve or produce the same wording."
          ],
          "alternative_explanations": [
            "A tool could preserve original phrasing.",
            "A non-native writer may also use grammar checking."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-A-CONTINUITY",
          "text": "Compare the original replies for repeated work and language-learning details.",
          "source_ids": [
            "C001",
            "C002"
          ],
          "priority": "Medium",
          "priority_reason": "The summaries describe continuity, but the relevant passages are not supplied."
        },
        {
          "id": "ACT-A-PHRASING",
          "text": "Check whether tentative phrasing recurs in a larger sample.",
          "source_ids": [
            "C001",
            "C002"
          ],
          "priority": "Low",
          "priority_reason": "One excerpt cannot establish a recurring writing pattern."
        },
        {
          "id": "ACT-A-PROCESS",
          "text": "Ask about editing or grammar checking only if the review question requires it.",
          "source_ids": [
            "C001",
            "C002"
          ],
          "priority": "Low",
          "priority_reason": "The supplied text cannot establish which tools were used."
        }
      ]
    },
    {
      "id": "translation",
      "name": "Case B: Cross-Language Influence",
      "short_name": "Cross-language wording",
      "question": "What can this wording tell us about the writing process?",
      "stage": "Personal correspondence",
      "posture": "Multiple plausible explanations",
      "overview": "The excerpt contains unusual collocations that could reflect cross-language influence. The summaries also mention personal continuity, but the original memory passages are not supplied here.",
      "reader_intuition": "The voice feels personal, but the English surface may be translation-supported.",
      "must_not_conclude": [
        "Do not treat translation as deception. Ask what layer was translated, checked, or rewritten.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [],
      "qualified_human_review_required": false,
      "coverage_note": "Medium",
      "limitations": [
        "Synthetic demo data.",
        "High if cross-language English is treated as AI generation.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "Local collocations",
          "description": "Inspect the wording without inferring a particular tool or source language.",
          "kind": "evidence",
          "id": "EV-B-LANGUAGE"
        },
        {
          "title": "Workflow not established",
          "description": "A direct process explanation would be more informative than surface guessing.",
          "kind": "claim",
          "id": "CL-B-PROCESS"
        }
      ],
      "sources": [
        {
          "id": "A001",
          "author_role": "Reviewer / context",
          "target_status": "context",
          "date": "2026-04-04",
          "reference": "synthetic:A001",
          "summary": "The reviewer asks whether the correspondent writes directly in English or translates.",
          "tags": [
            "Context only"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "C001",
          "author_role": "Correspondent / target",
          "target_status": "target",
          "date": "2026-04-06",
          "reference": "synthetic:C001",
          "summary": "The correspondent gives a personal answer but uses unusual collocations and direct source-language structure.",
          "tags": [
            "Cross-language influence",
            "Stable",
            "Verify gently"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-B-PROCESS",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [
            "EV-B-LANGUAGE"
          ],
          "action_ids": [
            "ACT-B-PROCESS"
          ],
          "text": "Writes in English or translates into English.",
          "type": "Process claim",
          "support_status": "Unknown",
          "review_posture": "Verify gently"
        },
        {
          "id": "CL-B-MEMORY",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [],
          "action_ids": [
            "ACT-B-CONTINUITY"
          ],
          "text": "Has personal memories connected to the topic.",
          "type": "Experience claim",
          "support_status": "Supported by detail",
          "review_posture": "Stable"
        },
        {
          "id": "CL-B-LANGUAGE",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [
            "EV-B-LANGUAGE"
          ],
          "action_ids": [
            "ACT-B-COMPARE",
            "ACT-B-PROCESS"
          ],
          "text": "The English surface reflects source-language influence.",
          "type": "Analytic observation",
          "support_status": "Observed once",
          "review_posture": "Low-confidence"
        }
      ],
      "evidence": [
        {
          "id": "EV-B-LANGUAGE",
          "source_ids": [
            "C001"
          ],
          "lane": "Authorship / mediation",
          "texture_axis": "source_texture",
          "action_ids": [
            "ACT-B-COMPARE",
            "ACT-B-PROCESS"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Cross-Language Influence",
          "attention": "Mediated layer",
          "excerpt": "I am respectful for this old music, but I cannot imagine how it is living in your day.",
          "marked_text": [
            {
              "text": "respectful for",
              "label": "preposition drift",
              "reason": "Clear meaning, unusual English collocation."
            },
            {
              "text": "how it is living",
              "label": "source-language shaping",
              "reason": "Possibly source-language structure carried into English."
            }
          ],
          "observation": "The content is personal and responsive.",
          "reasoning_chain": [
            "The English surface contains local non-native friction.",
            "This supports cross-language uncertainty, not AI authorship."
          ],
          "alternative_explanations": [
            "Direct non-native English.",
            "Machine translation with light editing.",
            "Human translation preserving source structure."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-B-PROCESS",
          "text": "Clarify the writing, translation, and editing workflow if relevant.",
          "source_ids": [
            "C001"
          ],
          "priority": "Medium",
          "priority_reason": "Several workflows can produce the same final wording."
        },
        {
          "id": "ACT-B-COMPARE",
          "text": "Compare the marked collocations with other supplied passages.",
          "source_ids": [
            "C001"
          ],
          "priority": "Low",
          "priority_reason": "The excerpt shows local wording only, not a stable language profile."
        },
        {
          "id": "ACT-B-CONTINUITY",
          "text": "Locate the original personal details and compare continuity independently of grammar.",
          "source_ids": [
            "C001"
          ],
          "priority": "Medium",
          "priority_reason": "The personal-memory claim has no supplied supporting excerpt."
        }
      ]
    },
    {
      "id": "mixed",
      "name": "Case C: Mixed Authorship / AI-Polish",
      "short_name": "Mixed writing segments",
      "question": "Do different parts of this reply need different kinds of review?",
      "stage": "Correspondence plus domain content",
      "posture": "Segment-level review recommended",
      "overview": "A domain-specific correction and a polished reflective passage appear in the same reply. They need separate checks: one against the actual board position, the other against the drafting context.",
      "reader_intuition": "Short domain-specific parts feel personal; longer reflective passages feel polished.",
      "must_not_conclude": [
        "Avoid one label for the whole person. Separate domain turns, emotional response, and polished prose.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [],
      "qualified_human_review_required": false,
      "coverage_note": "Medium-high",
      "limitations": [
        "Synthetic demo data.",
        "High if the polished passage is used to judge every message.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "The chess correction",
          "description": "Check domain accuracy separately from the prose surface.",
          "kind": "evidence",
          "id": "EV-C-BOARD"
        },
        {
          "title": "The reflective passage",
          "description": "Compare the cadence without turning polish into an authorship verdict.",
          "kind": "evidence",
          "id": "EV-C-PROSE"
        }
      ],
      "sources": [
        {
          "id": "A001",
          "author_role": "Reviewer / context",
          "target_status": "context",
          "date": "2026-04-05",
          "reference": "synthetic:A001",
          "summary": "The reviewer asks about a novel and continues a slow chess game.",
          "tags": [
            "Context only"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "C001",
          "author_role": "Correspondent / target",
          "target_status": "target",
          "date": "2026-04-06",
          "reference": "synthetic:C001",
          "summary": "The reply contains a precise chess correction and a polished literary reflection.",
          "tags": [
            "Domain anchor",
            "AI/editorial polish?",
            "Segment split"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-C-BOARD",
          "source_ids": [
            "A001",
            "C001"
          ],
          "evidence_ids": [
            "EV-C-BOARD"
          ],
          "action_ids": [
            "ACT-C-BOARD"
          ],
          "text": "The chess correction follows the current board state.",
          "type": "Domain claim",
          "support_status": "Source-grounded",
          "review_posture": "Stable"
        },
        {
          "id": "CL-C-PROSE",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [
            "EV-C-PROSE"
          ],
          "action_ids": [
            "ACT-C-SEGMENTS"
          ],
          "text": "The literary interpretation is polished and general.",
          "type": "Style observation",
          "support_status": "Segment-specific",
          "review_posture": "Review"
        },
        {
          "id": "CL-C-PROCESS",
          "source_ids": [
            "C001"
          ],
          "evidence_ids": [
            "EV-C-PROSE",
            "EV-C-BOARD"
          ],
          "action_ids": [
            "ACT-C-PROCESS"
          ],
          "text": "Different segments may have different creation histories.",
          "type": "Mediation hypothesis",
          "support_status": "Plausible",
          "review_posture": "Do not overclaim"
        }
      ],
      "evidence": [
        {
          "id": "EV-C-PROSE",
          "source_ids": [
            "C001"
          ],
          "lane": "Authorship / mediation",
          "texture_axis": "mediation_polish",
          "action_ids": [
            "ACT-C-SEGMENTS",
            "ACT-C-PROCESS"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Reflective prose polish",
          "attention": "Mediated layer",
          "excerpt": "The refuge becomes a quiet cage, a poetic punishment for refusing growth.",
          "marked_text": [
            {
              "text": "quiet cage",
              "label": "aphoristic polish",
              "reason": "Compact literary metaphor."
            },
            {
              "text": "poetic punishment",
              "label": "balanced evaluative phrase",
              "reason": "Smooth review-like cadence."
            }
          ],
          "observation": "The compact metaphor and evaluative cadence contrast with the operational correction supplied from the same reply.",
          "reasoning_chain": [
            "The same message also contains domain-specific handling.",
            "Different registers are visible, but different tools or authors are only possible explanations."
          ],
          "alternative_explanations": [
            "Careful human drafting.",
            "Human prose edited by AI.",
            "AI-generated reflection plus personal insertion."
          ]
        },
        {
          "id": "EV-C-BOARD",
          "source_ids": [
            "C001"
          ],
          "lane": "Claim reliability",
          "texture_axis": "source_texture",
          "action_ids": [
            "ACT-C-BOARD"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Domain Authorship Anchor",
          "attention": "Stable / anchored",
          "excerpt": "You wrote Nd2, but from this position I think you meant Nbd2.",
          "marked_text": [
            {
              "text": "Nbd2",
              "label": "domain-specific correction",
              "reason": "Requires tracking the game state."
            }
          ],
          "observation": "The correction is operational and specific.",
          "reasoning_chain": [
            "It differs from the polished literary cadence.",
            "Analyze it separately from the prose surface."
          ],
          "alternative_explanations": [
            "A domain tool could assist, but no evidence requires that."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-C-SEGMENTS",
          "text": "Compare the reflective passage and the operational correction separately.",
          "source_ids": [
            "C001"
          ],
          "priority": "Medium",
          "priority_reason": "The two passages answer different questions and should not receive one authorship label."
        },
        {
          "id": "ACT-C-PROCESS",
          "text": "Clarify the drafting and editing history of each segment if relevant.",
          "source_ids": [
            "C001"
          ],
          "priority": "Medium",
          "priority_reason": "A difference in register does not establish a difference in authorship."
        },
        {
          "id": "ACT-C-BOARD",
          "text": "Verify the chess correction against the actual board position.",
          "source_ids": [
            "A001",
            "C001"
          ],
          "priority": "Medium",
          "priority_reason": "Specific terminology is not proof that the move is correct."
        }
      ]
    },
    {
      "id": "newsletter",
      "name": "Case D: Institutional Newsletter",
      "short_name": "Newsletter claims",
      "question": "Which newsletter claims need an archive record or workflow explanation?",
      "stage": "Public document",
      "posture": "Multiple plausible explanations",
      "overview": "The document appears source-rich and institutionally edited. Final English may include translation, editorial smoothing, or AI assistance.",
      "reader_intuition": "No reader intuition supplied. Blind review mode.",
      "must_not_conclude": [
        "Separate source provenance, fact-checking, cross-language surface, and final prose polish.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [],
      "qualified_human_review_required": false,
      "coverage_note": "Medium",
      "limitations": [
        "Synthetic demo data modeled as a public newsletter.",
        "High if polished institutional English is treated as AI authorship.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "Object-specific details",
          "description": "Check the acquisition record behind the description.",
          "kind": "evidence",
          "id": "EV-D-DETAIL"
        },
        {
          "title": "Access statement",
          "description": "Separate a public-facing factual claim from formal writing style.",
          "kind": "claim",
          "id": "CL-D-ACCESS"
        }
      ],
      "sources": [
        {
          "id": "D001",
          "author_role": "Document / target",
          "target_status": "target",
          "date": "2026-04-20",
          "reference": "synthetic:D001",
          "summary": "A public newsletter combines archive object metadata, historical framing, and a polished support appeal.",
          "tags": [
            "Institutional template",
            "Archive specificity",
            "Editorial polish"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-D-CASSETTE",
          "source_ids": [
            "D001"
          ],
          "evidence_ids": [
            "EV-D-DETAIL"
          ],
          "action_ids": [
            "ACT-D-RECORD"
          ],
          "text": "The cassette contains two platform versions.",
          "type": "Material fact",
          "support_status": "Source-backed",
          "review_posture": "Verify with archive record"
        },
        {
          "id": "CL-D-ACCESS",
          "source_ids": [
            "D001"
          ],
          "evidence_ids": [
            "EV-D-SURFACE"
          ],
          "action_ids": [
            "ACT-D-ACCESS"
          ],
          "text": "The materials are available for consultation.",
          "type": "Access claim",
          "support_status": "Public-facing",
          "review_posture": "Verify"
        },
        {
          "id": "CL-D-PROCESS",
          "source_ids": [
            "D001"
          ],
          "evidence_ids": [
            "EV-D-SURFACE"
          ],
          "action_ids": [
            "ACT-D-PROCESS"
          ],
          "text": "Final English may hide source-language workflow.",
          "type": "Method caution",
          "support_status": "Low-confidence",
          "review_posture": "Use provenance evidence"
        }
      ],
      "evidence": [
        {
          "id": "EV-D-DETAIL",
          "source_ids": [
            "D001"
          ],
          "lane": "Claim reliability",
          "texture_axis": "source_texture",
          "action_ids": [
            "ACT-D-RECORD"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Object-specific description",
          "attention": "Stable / anchored",
          "excerpt": "The original cassette contains two platform versions on opposite sides, catalogued under the same acquisition record.",
          "marked_text": [
            {
              "text": "opposite sides",
              "label": "material detail",
              "reason": "Physical-object detail suggests source notes or archive knowledge."
            },
            {
              "text": "acquisition record",
              "label": "provenance cue",
              "reason": "Links final prose to archival practice."
            }
          ],
          "observation": "The excerpt names a physical arrangement and an acquisition record that a reviewer could check.",
          "reasoning_chain": [
            "Specificity does not prove access to the object: details could come from source notes, prompting, or invention.",
            "Source layer and sentence layer should be separated."
          ],
          "alternative_explanations": [
            "A well-prompted AI could rewrite supplied source notes."
          ]
        },
        {
          "id": "EV-D-SURFACE",
          "source_ids": [
            "D001"
          ],
          "lane": "Authorship / mediation",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-D-PROCESS",
            "ACT-D-ACCESS"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Low-Confidence Surface Signal",
          "attention": "Observe",
          "excerpt": "These materials served for the preparation of this article and are available for consultation.",
          "marked_text": [
            {
              "text": "served for the preparation",
              "label": "collocation heaviness",
              "reason": "Possible translation or institutional English; low confidence."
            },
            {
              "text": "available for consultation",
              "label": "formal register",
              "reason": "Could be human institutional phrasing."
            }
          ],
          "observation": "Final English is clean enough that source language is not detectable with confidence.",
          "reasoning_chain": [
            "Small collocation clues are weak alone.",
            "Workflow evidence matters more than surface guessing."
          ],
          "alternative_explanations": [
            "Human non-native English.",
            "Human translation.",
            "LLM translation plus human check.",
            "Institutional style."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-D-RECORD",
          "text": "Compare the cassette description with its acquisition record and source notes.",
          "source_ids": [
            "D001"
          ],
          "priority": "Medium",
          "priority_reason": "Detailed prose points to a checkable claim but does not verify the object."
        },
        {
          "id": "ACT-D-PROCESS",
          "text": "Clarify whether the final article was translated, edited, or AI-assisted.",
          "source_ids": [
            "D001"
          ],
          "priority": "Low",
          "priority_reason": "Formal English alone cannot establish the production workflow."
        },
        {
          "id": "ACT-D-ACCESS",
          "text": "Verify whether the described materials are currently available for consultation.",
          "source_ids": [
            "D001"
          ],
          "priority": "Medium",
          "priority_reason": "Public access information should be checked before it is reused."
        }
      ]
    },
    {
      "id": "academic",
      "name": "Case E: Academic Paper Review",
      "short_name": "Academic claims and methods",
      "question": "Do the visible methods support the paper's conclusions?",
      "stage": "Research article",
      "posture": "Claim-level verification recommended",
      "overview": "The paper has a coherent scholarly surface, but several claims require source-level verification before the argument should be relied on.",
      "reader_intuition": "No reader intuition supplied. Blind review mode.",
      "must_not_conclude": [
        "Separate prose polish from research reliability. A fluent academic surface can coexist with weak methods, unsupported citations, or overgeneralized conclusions.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [
        "academic evaluation",
        "publication"
      ],
      "qualified_human_review_required": true,
      "coverage_note": "Medium: abstract, method excerpt, and conclusion excerpt only",
      "limitations": [
        "Synthetic demo paper; no real unpublished manuscript included.",
        "High if polished prose is mistaken for methodological strength.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "Sampling and coding",
          "description": "The excerpt leaves the sampling frame and coding process underspecified.",
          "kind": "evidence",
          "id": "EV-E-METHOD"
        },
        {
          "title": "The 31% result",
          "description": "The quantitative claim has no supplied result excerpt or table.",
          "kind": "claim",
          "id": "CL-E-RESULT"
        },
        {
          "title": "Scope of the conclusion",
          "description": "Compare the cross-domain conclusion with what the visible methods support.",
          "kind": "evidence",
          "id": "EV-E-SCOPE"
        }
      ],
      "sources": [
        {
          "id": "P001",
          "author_role": "Paper / abstract",
          "target_status": "target",
          "date": "2026-05-02",
          "reference": "synthetic:P001",
          "summary": "The abstract introduces a narrative-provenance review method and reports improved analyst performance.",
          "tags": [
            "Scholarly surface",
            "Quantitative claim",
            "Claim review"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "P002",
          "author_role": "Paper / methods",
          "target_status": "target",
          "date": "2026-05-02",
          "reference": "synthetic:P002",
          "summary": "The methods section describes a 42-document corpus but gives limited sampling and coding detail.",
          "tags": [
            "Method gap",
            "Verify dataset"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "P003",
          "author_role": "Paper / conclusion",
          "target_status": "target",
          "date": "2026-05-02",
          "reference": "synthetic:P003",
          "summary": "The conclusion generalizes from the limited corpus to institutional review workflows.",
          "tags": [
            "Scope expansion",
            "Review"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-E-SAMPLE",
          "source_ids": [
            "P002"
          ],
          "evidence_ids": [
            "EV-E-METHOD"
          ],
          "action_ids": [
            "ACT-E-METHOD"
          ],
          "text": "The study uses a 42-document corpus.",
          "type": "Method claim",
          "support_status": "Partially specified",
          "review_posture": "Verify sampling protocol"
        },
        {
          "id": "CL-E-RESULT",
          "source_ids": [
            "P001",
            "P002"
          ],
          "evidence_ids": [],
          "action_ids": [
            "ACT-E-RESULT"
          ],
          "text": "The proposed review workflow improved analyst accuracy by 31%.",
          "type": "Quantitative result",
          "support_status": "Requires table support",
          "review_posture": "Verify"
        },
        {
          "id": "CL-E-SCOPE",
          "source_ids": [
            "P002",
            "P003"
          ],
          "evidence_ids": [
            "EV-E-SCOPE"
          ],
          "action_ids": [
            "ACT-E-SCOPE"
          ],
          "text": "The findings generalize to institutional review workflows.",
          "type": "Scope claim",
          "support_status": "Overextended from excerpt",
          "review_posture": "Review"
        },
        {
          "id": "CL-E-DEFINITION",
          "source_ids": [
            "P001"
          ],
          "evidence_ids": [
            "EV-E-CITATIONS"
          ],
          "action_ids": [
            "ACT-E-CITATIONS"
          ],
          "text": "Prior studies establish the same operational definition of narrative provenance.",
          "type": "Citation claim",
          "support_status": "Citation support unknown",
          "review_posture": "Verify cited sources"
        }
      ],
      "evidence": [
        {
          "id": "EV-E-METHOD",
          "source_ids": [
            "P002"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-E-METHOD"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Method Specificity Gap",
          "attention": "Review",
          "excerpt": "We selected forty-two documents representative of the field and coded them for provenance ambiguity.",
          "marked_text": [
            {
              "text": "representative of the field",
              "label": "sampling claim",
              "reason": "The population and selection method are not defined."
            },
            {
              "text": "coded them",
              "label": "method compression",
              "reason": "No coder count, codebook, or agreement metric is visible in the excerpt."
            }
          ],
          "observation": "The sentence makes a methodological claim but leaves the sampling frame underspecified.",
          "reasoning_chain": [
            "The reader cannot yet tell whether the corpus supports the result.",
            "This is a claim-reliability issue, not an authorship judgment."
          ],
          "alternative_explanations": [
            "Details may appear elsewhere in the paper.",
            "Supplementary materials may contain the protocol.",
            "This may be an excerpt-level limitation."
          ]
        },
        {
          "id": "EV-E-SCOPE",
          "source_ids": [
            "P003"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-E-SCOPE"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Overgeneralization Risk",
          "attention": "Review",
          "excerpt": "These results demonstrate that narrative-provenance mapping can improve institutional review workflows across domains.",
          "marked_text": [
            {
              "text": "demonstrate",
              "label": "strong causal verb",
              "reason": "The excerpt supports caution better than proof."
            },
            {
              "text": "across domains",
              "label": "scope expansion",
              "reason": "The claim reaches beyond the visible corpus description."
            }
          ],
          "observation": "The conclusion uses stronger language than the visible method supports.",
          "reasoning_chain": [
            "This should prompt source and scope review before citation.",
            "The issue is evidential strength rather than whether the prose is human or AI-written."
          ],
          "alternative_explanations": [
            "The full paper may include cross-domain validation.",
            "The authors may be using demonstration in a softer rhetorical sense."
          ]
        },
        {
          "id": "EV-E-CITATIONS",
          "source_ids": [
            "P001"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-E-CITATIONS"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Citation Support Check",
          "attention": "Observe",
          "excerpt": "Prior work has established narrative provenance as a stable operational category.",
          "marked_text": [
            {
              "text": "established",
              "label": "citation strength",
              "reason": "A broad literature claim needs source-level checking."
            },
            {
              "text": "stable operational category",
              "label": "definition claim",
              "reason": "The definition may vary across fields."
            }
          ],
          "observation": "The phrase signals a literature-foundation claim.",
          "reasoning_chain": [
            "A reviewer should inspect whether the cited sources actually use the same definition.",
            "This belongs in the claim lane even if the writing style is polished."
          ],
          "alternative_explanations": [
            "The literature review may define the term carefully later.",
            "The abstract may compress a nuanced discussion."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-E-METHOD",
          "text": "Request the sampling frame, inclusion criteria, codebook, and coding protocol.",
          "source_ids": [
            "P002"
          ],
          "priority": "High",
          "priority_reason": "The visible method lacks details needed to assess the sample and analysis."
        },
        {
          "id": "ACT-E-RESULT",
          "text": "Trace the 31% improvement claim to the study design, comparison, and result tables.",
          "source_ids": [
            "P001",
            "P002"
          ],
          "priority": "High",
          "priority_reason": "A numerical result is listed, but its original result passage and table are not supplied."
        },
        {
          "id": "ACT-E-SCOPE",
          "text": "Check whether the full study validates the conclusion across domains.",
          "source_ids": [
            "P002",
            "P003"
          ],
          "priority": "Medium",
          "priority_reason": "The conclusion extends beyond the scope supported by the available excerpts."
        },
        {
          "id": "ACT-E-CITATIONS",
          "text": "Check whether the cited studies use and support the same operational definition.",
          "source_ids": [
            "P001"
          ],
          "priority": "Medium",
          "priority_reason": "The literature-foundation claim needs source-level corroboration."
        }
      ]
    },
    {
      "id": "public_figures",
      "name": "Case F: Public AI Leadership Narrative Dossier",
      "short_name": "Public statements and source roles",
      "question": "Which statements can be attributed to which source and date?",
      "stage": "Public-source narrative review",
      "posture": "Source-boundary review recommended",
      "overview": "The useful question is not whether one public figure is consistent or inconsistent in the abstract. The review task is to map which source said what, in what role, at what time, and with what evidentiary weight.",
      "reader_intuition": "No private reader intuition supplied. This demo uses public materials about AI leaders to show how Tracewright separates authored statements, corporate pages, external reporting, adversarial sources, and source-inventory gaps.",
      "must_not_conclude": [
        "Do not collapse a public person, their company, a news report, a competitor statement, and a technical paper into one flat narrative. Treat this as source-boundary and chronology review, not personality judgment.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [
        "reputation",
        "publication"
      ],
      "qualified_human_review_required": true,
      "coverage_note": "Low-medium: representative public sources only, not a complete biography or fact investigation",
      "limitations": [
        "Illustrative public-source categories and review notes only; no primary public records are reproduced.",
        "High if company claims, reported remarks, external allegations, and adversarial statements are attributed directly to a person without source-role labels.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "Interested sources",
          "description": "Keep a claim attached to its source while seeking corroboration.",
          "kind": "evidence",
          "id": "EV-F-ADVERSARIAL"
        },
        {
          "title": "Chronology and scope",
          "description": "A later action and an earlier statement need a dated comparison.",
          "kind": "evidence",
          "id": "EV-F-CHRONOLOGY"
        },
        {
          "title": "Organizational documents",
          "description": "Do not equate company authorship with a single person.",
          "kind": "evidence",
          "id": "EV-F-COMPANY"
        }
      ],
      "sources": [
        {
          "id": "PF001",
          "author_role": "Authored essay / public post",
          "target_status": "target",
          "date": "2024-2026",
          "reference": "public:authored-essays",
          "summary": "Representative authored materials include Dario Amodei essays and Sam Altman blog posts. They can anchor dated self-positioning but not every company action.",
          "tags": [
            "Authored layer",
            "Date anchor"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PF002",
          "author_role": "Company policy / product page",
          "target_status": "target",
          "date": "2025-2026",
          "reference": "public:company-pages",
          "summary": "Representative company materials include Anthropic policy pages and xAI product/company pages. They show organizational posture and implementation claims.",
          "tags": [
            "Corporate layer",
            "Implementation claim"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PF003",
          "author_role": "External or adversarial source",
          "target_status": "target",
          "date": "2024-2026",
          "reference": "public:external-sources",
          "summary": "External reporting, open letters, and competitor statements may be important, but each needs role labeling and corroboration.",
          "tags": [
            "Source boundary",
            "Attribution required"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PF004",
          "author_role": "Chronology map",
          "target_status": "target",
          "date": "2023-2026",
          "reference": "public:timeline",
          "summary": "A public narrative may change over time as models, companies, law, risk perception, and competition change. The first review step is dated mapping.",
          "tags": [
            "Chronology",
            "Review pressure"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-F-POSITION",
          "source_ids": [
            "PF001"
          ],
          "evidence_ids": [
            "EV-F-POSITION"
          ],
          "action_ids": [
            "ACT-F-ROLES"
          ],
          "text": "Authored essays or blog posts can support a person's stated position at a date.",
          "type": "Source-boundary claim",
          "support_status": "Supported by public sources",
          "review_posture": "Stable"
        },
        {
          "id": "CL-F-COMPANY",
          "source_ids": [
            "PF002"
          ],
          "evidence_ids": [
            "EV-F-COMPANY"
          ],
          "action_ids": [
            "ACT-F-ROLES"
          ],
          "text": "Corporate policy pages should not automatically be treated as single-person statements.",
          "type": "Method claim",
          "support_status": "General review rule",
          "review_posture": "Stable"
        },
        {
          "id": "CL-F-ATTRIBUTION",
          "source_ids": [
            "PF003"
          ],
          "evidence_ids": [
            "EV-F-ADVERSARIAL"
          ],
          "action_ids": [
            "ACT-F-CORROBORATE",
            "ACT-F-PRIMARY"
          ],
          "text": "External reporting and adversarial statements require attribution and corroboration.",
          "type": "Reliability claim",
          "support_status": "High-priority rule",
          "review_posture": "Review"
        },
        {
          "id": "CL-F-CHRONOLOGY",
          "source_ids": [
            "PF001",
            "PF002",
            "PF004"
          ],
          "evidence_ids": [
            "EV-F-CHRONOLOGY"
          ],
          "action_ids": [
            "ACT-F-TIMELINE"
          ],
          "text": "Apparent changes in AI policy posture should be tested through chronology before being called contradictions.",
          "type": "Chronology claim",
          "support_status": "Review method",
          "review_posture": "Review"
        }
      ],
      "evidence": [
        {
          "id": "EV-F-POSITION",
          "source_ids": [
            "PF001"
          ],
          "lane": "Disclosure / provenance",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-F-ROLES"
          ],
          "excerpt_kind": "Illustrative review note",
          "title": "Authored-position anchor",
          "attention": "Stable / anchored",
          "excerpt": "A signed essay or personal blog post can anchor that a person publicly held or framed a position at a given time.",
          "marked_text": [
            {
              "text": "signed essay",
              "label": "source role",
              "reason": "Authored text is stronger for self-positioning than for proving implementation."
            },
            {
              "text": "at a given time",
              "label": "chronology",
              "reason": "The date matters before consistency is assessed."
            }
          ],
          "observation": "The note distinguishes evidence of a public position from evidence that the position was implemented.",
          "reasoning_chain": [
            "The note describes an attribution boundary, not a texture observation from an actual authored passage.",
            "The review should preserve the distinction between position, aspiration, and implementation."
          ],
          "alternative_explanations": [
            "A post may be edited, ghost-edited, or strategically framed.",
            "A public post may omit internal constraints or later changes."
          ]
        },
        {
          "id": "EV-F-COMPANY",
          "source_ids": [
            "PF002"
          ],
          "lane": "Disclosure / provenance",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-F-ROLES"
          ],
          "excerpt_kind": "Illustrative review note",
          "title": "Corporate-policy boundary",
          "attention": "Source role",
          "excerpt": "Company pages and policy announcements can describe commitments, product posture, or safety processes, but they are organizational documents.",
          "marked_text": [
            {
              "text": "Company pages",
              "label": "organizational source",
              "reason": "Do not treat as a single individual's direct authored claim."
            },
            {
              "text": "commitments",
              "label": "implementation claim",
              "reason": "Requires evidence of actual process or enforcement."
            }
          ],
          "observation": "The source can be public and useful while still being role-bound.",
          "reasoning_chain": [
            "This belongs in Disclosure / provenance because authority depends on source type.",
            "Tracewright should keep the corporate layer visible."
          ],
          "alternative_explanations": [
            "The leader may have approved the page.",
            "A policy may reflect legal, communications, or team drafting."
          ]
        },
        {
          "id": "EV-F-ADVERSARIAL",
          "source_ids": [
            "PF003"
          ],
          "lane": "Disclosure / provenance",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-F-CORROBORATE",
            "ACT-F-PRIMARY"
          ],
          "excerpt_kind": "Illustrative review note",
          "title": "Adversarial-source warning",
          "attention": "Review",
          "excerpt": "A competitor statement, lawsuit-position page, or strongly interested source may contain useful documents while still requiring attribution and corroboration.",
          "marked_text": [
            {
              "text": "competitor statement",
              "label": "source boundary",
              "reason": "Evidence-bearing does not mean neutral."
            },
            {
              "text": "requiring attribution",
              "label": "handling rule",
              "reason": "Claims should remain attached to the source until checked."
            }
          ],
          "observation": "This is a central public-figure dossier risk.",
          "reasoning_chain": [
            "The source may contain real records, but framing can be strategic.",
            "The dashboard should prevent the reader from silently absorbing it as neutral biography."
          ],
          "alternative_explanations": [
            "The adversarial source may be accurate.",
            "The opposing side may dispute or contextualize it.",
            "Court filings or primary documents may settle part of the record."
          ]
        },
        {
          "id": "EV-F-CHRONOLOGY",
          "source_ids": [
            "PF001",
            "PF002",
            "PF004"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-F-TIMELINE"
          ],
          "excerpt_kind": "Illustrative review note",
          "title": "Chronology / implementation pressure",
          "attention": "Review",
          "excerpt": "A safety-warning statement, later product launch, government deployment claim, or regulation proposal may look inconsistent unless placed in a dated timeline with role labels.",
          "marked_text": [
            {
              "text": "safety-warning statement",
              "label": "early posture",
              "reason": "Could be collective, personal, or company-level."
            },
            {
              "text": "later product launch",
              "label": "implementation layer",
              "reason": "Should be compared with actual safeguards and dates."
            },
            {
              "text": "dated timeline",
              "label": "review method",
              "reason": "Chronology comes before contradiction."
            }
          ],
          "observation": "The same person can hold risk concerns while building products; that is tension, not automatically contradiction.",
          "reasoning_chain": [
            "The review should ask whether implementation evidence matches the public risk posture.",
            "This card shows how Tracewright slows reputational judgment."
          ],
          "alternative_explanations": [
            "The timeline may reveal a genuine contradiction.",
            "Product or policy details may resolve the tension.",
            "External reporting may be incomplete."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-F-ROLES",
          "text": "Keep direct authored texts separate from company policy pages.",
          "source_ids": [
            "PF001",
            "PF002"
          ],
          "priority": "Medium",
          "priority_reason": "Personal positions and organizational commitments have different attribution boundaries."
        },
        {
          "id": "ACT-F-CORROBORATE",
          "text": "Attribute external or adversarial claims and seek primary corroboration.",
          "source_ids": [
            "PF003"
          ],
          "priority": "High",
          "priority_reason": "Interested framing must not silently become an established fact about a person."
        },
        {
          "id": "ACT-F-TIMELINE",
          "text": "Build a dated timeline of statements and implementation before asserting contradiction.",
          "source_ids": [
            "PF001",
            "PF002",
            "PF004"
          ],
          "priority": "Medium",
          "priority_reason": "Changes in scope, date, and role may explain apparent tension."
        },
        {
          "id": "ACT-F-PRIMARY",
          "text": "Obtain the original filings, transcripts, or full articles for any claim to be escalated.",
          "source_ids": [
            "PF003",
            "PF004"
          ],
          "priority": "High",
          "priority_reason": "This demo supplies illustrative review notes, not the primary records required for an allegation."
        }
      ]
    },
    {
      "id": "painting_provenance",
      "name": "Case G: Eighteenth-Century Painting Provenance Dossier",
      "short_name": "Painting provenance",
      "question": "Which provenance links are supported, disputed, or still missing?",
      "stage": "Art provenance review",
      "posture": "Provenance-gap review recommended",
      "overview": "The dossier contains several useful anchors, but the chain is not continuous. A studio ledger, a nineteenth-century diary, an auction record, a wartime gap, a later researcher note, and a conservation memo each answer different questions and carry different evidentiary weight.",
      "reader_intuition": "No private collector file is included. This synthetic case shows how Tracewright can review a mixed dossier around an old painting without turning uncertainty into a verdict about authenticity or ownership.",
      "must_not_conclude": [
        "Do not collapse attribution, ownership history, wartime custody, and current title into one confidence label. The next responsible step is to separate source roles, date each claim, and identify which gaps are ordinary archival loss versus high-stakes provenance risk.",
        "Do not infer human or AI authorship from texture cues.",
        "A flag means inspect carefully, not that someone did something wrong."
      ],
      "high_impact_context": [
        "provenance",
        "financial judgment"
      ],
      "qualified_human_review_required": true,
      "coverage_note": "Medium-low: synthetic source excerpts only, with intentional gaps in the chain of custody",
      "limitations": [
        "Synthetic demo dossier; no real artwork, collector, archive, or private ownership file is included.",
        "High if the studio ledger, diary, auction catalogue, and modern researcher note are treated as one continuous proof chain.",
        "Only the displayed synthetic excerpts and summaries are included; full documents are not supplied."
      ],
      "focus": [
        {
          "title": "Missing custody interval",
          "description": "Keep the gap explicit while checking records and alternative explanations.",
          "kind": "evidence",
          "id": "EV-G-GAP"
        },
        {
          "title": "Diary and auction descriptions",
          "description": "Compare the conflicting details before joining the records.",
          "kind": "evidence",
          "id": "EV-G-DESCRIPTION"
        },
        {
          "title": "The missing family list",
          "description": "Inspect the source behind the later attribution.",
          "kind": "evidence",
          "id": "EV-G-RESEARCH"
        }
      ],
      "sources": [
        {
          "id": "PR001",
          "author_role": "Collector file / object summary",
          "target_status": "target",
          "date": "2026-05-18",
          "reference": "synthetic:collector-file",
          "summary": "The current owner holds a small oil painting known as Woman with a Blue Ribbon, attributed in the file to Elodie Marchand, circa 1772.",
          "tags": [
            "Current file",
            "Attribution claim",
            "Context only until checked"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PR002",
          "author_role": "Artist record / studio ledger",
          "target_status": "target",
          "date": "1772",
          "reference": "synthetic:studio-ledger",
          "summary": "A studio ledger records a portrait of a young woman with a blue ribbon delivered to a Paris patron, but it does not include dimensions or a later owner.",
          "tags": [
            "Date anchor",
            "Attribution boundary"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PR003",
          "author_role": "Collector diary",
          "target_status": "target",
          "date": "1849",
          "reference": "synthetic:diary-1849",
          "summary": "A handwritten diary describes buying a small French portrait of a girl with blue ribbon from the de Vries family collection.",
          "tags": [
            "Ownership clue",
            "Source-grounded texture"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PR004",
          "author_role": "Auction catalogue",
          "target_status": "target",
          "date": "1850",
          "reference": "synthetic:auction-1850",
          "summary": "An auction catalogue lists Lot 37 as Portrait of a Young Lady, French school, blue sash, but the dimensions differ from the current painting by several centimeters.",
          "tags": [
            "Possible match",
            "Description mismatch"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PR005",
          "author_role": "Wartime custody file",
          "target_status": "target",
          "date": "1939-1947",
          "reference": "synthetic:wartime-gap",
          "summary": "The dossier has insurance correspondence from 1938 and a gallery receipt from 1948, but no direct record for the war years.",
          "tags": [
            "Provenance gap",
            "High attention"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PR006",
          "author_role": "Researcher note",
          "target_status": "target",
          "date": "1978",
          "reference": "synthetic:research-note",
          "summary": "A researcher wrote that the picture is probably by Marchand, citing an old family list and stylistic comparison, but the family list is not attached.",
          "tags": [
            "Secondary source",
            "Citation gap"
          ],
          "availability": "summary_and_linked_excerpts"
        },
        {
          "id": "PR007",
          "author_role": "Conservation memo",
          "target_status": "target",
          "date": "2026",
          "reference": "synthetic:conservation-memo",
          "summary": "A conservation memo reports canvas weave and pigment findings consistent with late eighteenth-century French materials.",
          "tags": [
            "Material anchor",
            "Not authorship proof"
          ],
          "availability": "summary_and_linked_excerpts"
        }
      ],
      "claims": [
        {
          "id": "CL-G-ARTIST",
          "source_ids": [
            "PR001",
            "PR002",
            "PR006",
            "PR007"
          ],
          "evidence_ids": [
            "EV-G-ATTRIBUTION",
            "EV-G-RESEARCH",
            "EV-G-MATERIAL"
          ],
          "action_ids": [
            "ACT-G-ATTRIBUTION"
          ],
          "text": "The painting may be by Elodie Marchand or her workshop, circa 1772.",
          "type": "Attribution claim",
          "support_status": "Plausible but not settled",
          "review_posture": "Specialist review"
        },
        {
          "id": "CL-G-DIARY",
          "source_ids": [
            "PR003"
          ],
          "evidence_ids": [
            "EV-G-DESCRIPTION"
          ],
          "action_ids": [
            "ACT-G-DESCRIPTION"
          ],
          "text": "A painting matching the current work appears in an 1849 collector diary.",
          "type": "Ownership-history claim",
          "support_status": "Partially matched",
          "review_posture": "Verify description"
        },
        {
          "id": "CL-G-AUCTION",
          "source_ids": [
            "PR004"
          ],
          "evidence_ids": [
            "EV-G-DESCRIPTION"
          ],
          "action_ids": [
            "ACT-G-DESCRIPTION"
          ],
          "text": "Lot 37 in an 1850 auction catalogue may be the same object.",
          "type": "Provenance link",
          "support_status": "Conflicting details",
          "review_posture": "Review"
        },
        {
          "id": "CL-G-GAP",
          "source_ids": [
            "PR005"
          ],
          "evidence_ids": [
            "EV-G-GAP"
          ],
          "action_ids": [
            "ACT-G-GAP"
          ],
          "text": "The chain of custody is undocumented between 1939 and 1947.",
          "type": "Provenance-gap claim",
          "support_status": "Explicit gap",
          "review_posture": "High attention"
        },
        {
          "id": "CL-G-RESEARCH",
          "source_ids": [
            "PR006"
          ],
          "evidence_ids": [
            "EV-G-RESEARCH"
          ],
          "action_ids": [
            "ACT-G-FAMILY"
          ],
          "text": "A 1978 researcher note treats the attribution as likely.",
          "type": "Secondary-source claim",
          "support_status": "Source-boundary needed",
          "review_posture": "Check citations"
        },
        {
          "id": "CL-G-MATERIAL",
          "source_ids": [
            "PR007"
          ],
          "evidence_ids": [
            "EV-G-MATERIAL"
          ],
          "action_ids": [
            "ACT-G-MATERIAL"
          ],
          "text": "Pigment and canvas findings are consistent with late eighteenth-century materials.",
          "type": "Material-analysis claim",
          "support_status": "Supports date range, not authorship",
          "review_posture": "Do not overclaim"
        }
      ],
      "evidence": [
        {
          "id": "EV-G-ATTRIBUTION",
          "source_ids": [
            "PR002"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-G-ATTRIBUTION"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Attribution Boundary",
          "attention": "Observe",
          "excerpt": "The ledger records 'portrait of a young woman, blue ribbon, for M. Armand' in 1772, but gives no dimensions, signature reference, or later owner.",
          "marked_text": [
            {
              "text": "portrait of a young woman, blue ribbon",
              "label": "descriptive overlap",
              "reason": "The phrase may align with the present painting but is not unique enough."
            },
            {
              "text": "no dimensions",
              "label": "missing identifier",
              "reason": "The record cannot yet be tied securely to the object."
            },
            {
              "text": "or later owner",
              "label": "chain break",
              "reason": "The ledger supports a possible origin, not continuous provenance."
            }
          ],
          "observation": "The ledger is an early date anchor but not a full identification.",
          "reasoning_chain": [
            "The description is plausible yet generic.",
            "Attribution and ownership history should stay separate."
          ],
          "alternative_explanations": [
            "The full ledger may contain adjacent entries.",
            "A patron archive may identify M. Armand.",
            "The present painting may be a related work rather than the same object."
          ]
        },
        {
          "id": "EV-G-DESCRIPTION",
          "source_ids": [
            "PR003",
            "PR004"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-G-DESCRIPTION"
          ],
          "excerpt_kind": "Synthetic comparison note",
          "title": "Diary / Auction Mismatch",
          "attention": "Review",
          "excerpt": "The diary says 'a small French portrait of a girl with a blue ribbon'; the auction catalogue lists 'Portrait of a Young Lady, French school, blue sash' with dimensions that differ from the current painting.",
          "marked_text": [
            {
              "text": "blue ribbon",
              "label": "possible continuity",
              "reason": "The motif overlaps with the current file."
            },
            {
              "text": "blue sash",
              "label": "description drift",
              "reason": "The catalogue wording may refer to a different visual feature."
            },
            {
              "text": "dimensions that differ",
              "label": "material mismatch",
              "reason": "A measurable discrepancy requires checking before linking the records."
            }
          ],
          "observation": "The two records may describe the same object imprecisely, but the mismatch is substantive enough to flag.",
          "reasoning_chain": [
            "The review should compare measurements, frame changes, relining history, and catalogue conventions.",
            "This is a provenance-link problem, not an authenticity verdict."
          ],
          "alternative_explanations": [
            "Old catalogues may round measurements.",
            "A relining or frame note may explain size changes.",
            "The diary and auction lot may be different paintings in the same collection."
          ]
        },
        {
          "id": "EV-G-GAP",
          "source_ids": [
            "PR005"
          ],
          "lane": "Claim reliability",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-G-GAP"
          ],
          "excerpt_kind": "Synthetic comparison note",
          "title": "Wartime Provenance Gap",
          "attention": "High attention",
          "excerpt": "The file moves from a 1938 insurance letter to a 1948 gallery receipt, with no direct custody record during the war years.",
          "marked_text": [
            {
              "text": "1938 insurance letter",
              "label": "pre-gap anchor",
              "reason": "The object appears before the war-period gap."
            },
            {
              "text": "1948 gallery receipt",
              "label": "post-gap anchor",
              "reason": "The object appears after the gap."
            },
            {
              "text": "no direct custody record",
              "label": "archival silence",
              "reason": "The missing interval is the key evidence problem."
            }
          ],
          "observation": "A wartime gap does not prove wrongdoing, but it is a high-attention provenance issue.",
          "reasoning_chain": [
            "The gap should be named explicitly rather than hidden under a continuous ownership narrative.",
            "Qualified provenance review is needed before relying on the chain for title, sale, donation, or publication."
          ],
          "alternative_explanations": [
            "Records may have been lost.",
            "The object may have remained with the same family.",
            "External archives, customs files, or gallery stock books may close the gap."
          ]
        },
        {
          "id": "EV-G-RESEARCH",
          "source_ids": [
            "PR006"
          ],
          "lane": "Disclosure / provenance",
          "texture_axis": "not_applicable",
          "action_ids": [
            "ACT-G-FAMILY"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Researcher-Note Boundary",
          "attention": "Mediated layer",
          "excerpt": "The 1978 note says 'probably Marchand' and refers to an old family list, but the list is not attached to the dossier.",
          "marked_text": [
            {
              "text": "probably Marchand",
              "label": "attribution softness",
              "reason": "The researcher uses cautious language."
            },
            {
              "text": "old family list",
              "label": "missing cited source",
              "reason": "The supporting document is not available in the reviewed file."
            },
            {
              "text": "not attached",
              "label": "provenance disclosure",
              "reason": "The reviewer should not treat the note as if the primary source were present."
            }
          ],
          "observation": "A respected researcher note can be valuable, but its evidentiary weight depends on the cited material.",
          "reasoning_chain": [
            "The dashboard should preserve the distinction between expert opinion and visible primary evidence.",
            "The next action is to locate the family list or quote its contents accurately."
          ],
          "alternative_explanations": [
            "The researcher may have seen the list directly.",
            "The list may exist in another archive.",
            "The attribution may rest more on style than on documentary provenance."
          ]
        },
        {
          "id": "EV-G-MATERIAL",
          "source_ids": [
            "PR007"
          ],
          "lane": "Claim reliability",
          "texture_axis": "source_texture",
          "action_ids": [
            "ACT-G-MATERIAL",
            "ACT-G-ATTRIBUTION"
          ],
          "excerpt_kind": "Synthetic excerpt",
          "title": "Material Analysis Anchor",
          "attention": "Stable / anchored",
          "excerpt": "Canvas weave, ground layer, and pigment findings are consistent with late eighteenth-century French materials.",
          "marked_text": [
            {
              "text": "consistent with",
              "label": "supporting language",
              "reason": "The memo supports compatibility, not certainty."
            },
            {
              "text": "late eighteenth-century French materials",
              "label": "date-range support",
              "reason": "Material evidence can support the period claim."
            },
            {
              "text": "pigment findings",
              "label": "technical anchor",
              "reason": "A physical examination provides a different source layer from written provenance."
            }
          ],
          "observation": "Technical findings help test whether the object could belong to the proposed period.",
          "reasoning_chain": [
            "They do not prove Marchand authorship or uninterrupted ownership.",
            "This card helps separate material compatibility from narrative provenance."
          ],
          "alternative_explanations": [
            "Later artists may use old materials.",
            "The memo may need full lab data.",
            "Condition history may affect interpretation."
          ]
        }
      ],
      "actions": [
        {
          "id": "ACT-G-ATTRIBUTION",
          "text": "Have a specialist separate attribution evidence from ownership and material evidence.",
          "source_ids": [
            "PR001",
            "PR002",
            "PR006",
            "PR007"
          ],
          "priority": "Medium",
          "priority_reason": "Period compatibility and expert attribution do not establish a continuous ownership chain."
        },
        {
          "id": "ACT-G-DESCRIPTION",
          "text": "Compare the diary, auction dimensions, and the current object, including framing history.",
          "source_ids": [
            "PR001",
            "PR003",
            "PR004"
          ],
          "priority": "Medium",
          "priority_reason": "The descriptions may refer to different works or use different measurement conventions."
        },
        {
          "id": "ACT-G-GAP",
          "text": "Map the missing custody interval and have a qualified provenance specialist review the wartime records.",
          "source_ids": [
            "PR005"
          ],
          "priority": "High",
          "priority_reason": "The interval matters before relying on the chain; absence alone does not establish wrongdoing."
        },
        {
          "id": "ACT-G-FAMILY",
          "text": "Locate the family list cited by the 1978 researcher and inspect its contents.",
          "source_ids": [
            "PR006"
          ],
          "priority": "Medium",
          "priority_reason": "The secondary note depends on a source not supplied in the dossier."
        },
        {
          "id": "ACT-G-MATERIAL",
          "text": "Inspect the full conservation report and limits of the material dating.",
          "source_ids": [
            "PR007"
          ],
          "priority": "Medium",
          "priority_reason": "Material compatibility does not prove the named artist or current title."
        }
      ]
    }
  ]
};
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.TracewrightDemoData = data;
})(typeof globalThis !== "undefined" ? globalThis : this);
