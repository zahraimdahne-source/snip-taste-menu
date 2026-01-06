run# 🗣️ The "Master Conversation" Prompt (Phase 3)

**Copy and paste this into ChatGPT/Gemini to get the data that binds everything together.**

---

**Role:**
Expert Moroccan Darija Linguist & Chatbot Designer.

**Goal:**
We have the "Facts" and the "Personality". Now we need the **"Glue"** (Conversation Flow).
Create a JSON dataset named `conversational_flows` that handles **General Small Talk**, **Connectors**, and **Transitions** in authentic Casablanca Darija.

**Task:**
Generate a JSON object with these 5 specific modules:

1.  **PHATIC_COMMUNICATION** (Small Talk / Fillers):
    - **ACKNOWLEDGMENT**: How to say "Okay", "I get it", "Understood" (e.g., _Wakha_, _Safi_, _Fhamtk_, _Machi mochkil_).
    - **HESITATION**: Responses when user says "Wait", "Blati", "Chouf".
    - **AGREEMENT**: "D'accord", "Ca marche", "Hania".

2.  **CLARIFICATION_REQUESTS**:
    - How to ask "What do you mean?" or "Repeat please" in a cool way (e.g., _Chno glti?_, _3awd?_, _Mafhamtch_).

3.  **MIXED_LANG_HANDLING**:
    - Replies for when user mixes French/English/Darija (e.g., "Oui c'est bon", "Nice one").

4.  **CONFIRMATION_FLOWS**:
    - **YES_INTENT**: Triggers for "Ah", "Oui", "Wah", "Iyyeh" -> Bot says "Nadi, on avance!".
    - **NO_INTENT**: Triggers for "La", "No", "Pas du tout" -> Bot says "Wakha, baddelna rayna?".

5.  **CLOSING_CONVERSATION**:
    - Cool ways to say goodbye (e.g., _Thalla_, _Lay 3awn_, _Bslama_, _A plus_).

### Structure Required:

```json
{
  "conversational_flows": {
    "phatic": {
      "acknowledgment": {
        "keywords": ["wakha", "safi", "d'accord", "ok", "ca marche", "hania", "machi mochkil"],
        "reply": "Safi mchate! 👌 Chno akhor?"
      },
      "hesitation": {
        "keywords": ["blati", "tsenna", "wait", "dqiqa", "sbarni"],
        "reply": "Khod ra7tek a chef, hna kantsnnaw ⏳"
      }
    },
    "clarification": {
      "keywords": ["mafhamtch", "chno?", "comment?", "kifach", "chnou"],
      "reply": "Sma7 lia, ymken ma wdd7tchmzian. Bghiti Tacos wla Burger? 🍔🌮"
    },
    "confirmation": {
      "yes": {
        "keywords": ["ah", "oui", "wi", "iyyeh", "yep", "yes", "ok sur"],
        "reply": "Mzyan! On valide? ✅"
      },
      "no": {
        "keywords": ["la", "non", "no", "nn", "pas maintenant", "nope"],
        "reply": "Safi machi mochkil, chno bghiti f blastou? 🤔"
      }
    },
    "closing": {
      "keywords": ["thalla", "bslama", "bye", "ciao", "lay 3awn", "lah yhafdek"],
      "reply": "Thalla a l3chiron! Marhba bik f ay wa9t 👋🔥"
    }
  }
}
```

**Instructions:**

- Keep it **Casawi Street Style** (Casual, friendly).
- Focus on **universal replies** that fit most situations.
- **JSON Only**.

---
