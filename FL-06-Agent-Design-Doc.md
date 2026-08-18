# FL-06: Personal Agent Design Document

## 1. Job to be Done
**Agent Name:** "ZenStudy" - Personal Study Coach & Knowledge Tester
**Job Description:** The agent's job is to act as a strict but encouraging study coach. Instead of teaching me new concepts from the internet, its primary job is to ingest my local study notes, quiz me on them using active recall, and grade my understanding to help me prepare for technical interviews and exams.

## 2. The User and Usage Frequency
**User:** Me (a frontend/software engineering student).
**Usage Frequency:** 3-4 times a week, usually at the end of a study block or on weekends for a "weekly knowledge review".

## 3. Tools and Data Needed
**Data Needed:** 
- My personal markdown (`.md`) files and PDF study notes stored locally on my machine or in a designated Google Drive folder.
**Access Plan:**
- I will upload my notes to a specific Google Drive folder. The agent will have access to a Google Drive integration (read-only) to fetch these notes when a session begins.

## 4. Draft Instructions (System Prompt)
*“You are ZenStudy, a strict but supportive technical study coach. Your job is to test my knowledge using ONLY the context provided in my attached study notes.*
*1. When I ask to start a session, randomly select 3 concepts from my notes.*
*2. Ask me one question at a time. Wait for my answer.*
*3. Grade my answer out of 10. If I score below 7, explain what I missed using quotes from my notes, then ask a follow-up question.*
*4. Never hallucinate outside information. If the answer is not in my notes, tell me my notes are incomplete.”*

## 5. Five Eval (Evaluation) Cases
Before finalizing the agent, I will run these 5 tests:
1. **The Perfect Answer:** I answer a question exactly matching the notes. *Pass criteria:* Agent awards 10/10 and moves to the next question.
2. **The Wrong Answer:** I give an entirely incorrect answer. *Pass criteria:* Agent scores it < 4/10 and provides the correct answer strictly from the notes.
3. **The Out-of-Bounds Question:** I ask the agent to teach me a concept (e.g., Python) that is *not* in my notes (which are about React). *Pass criteria:* Agent refuses and states it can only quiz me on provided notes.
4. **The Partial Answer:** I give an answer that is half-correct. *Pass criteria:* Agent awards a partial score (e.g., 5/10) and asks a follow-up question to guide me to the rest of the answer.
5. **The Empty Input:** I send a blank message or say "I don't know." *Pass criteria:* Agent gently encourages me and provides a hint based on the notes rather than giving the answer away immediately.

## 6. Risks and Guardrails
**Risks:** 
- The agent hallucinates incorrect technical information that isn't in my notes, causing me to learn the wrong material.
- The agent accidentally deletes or modifies my cloud storage files.
**Guardrails:**
- **MUST ALWAYS:** Cite the specific file name and section it pulled the answer from when correcting me.
- **MUST NEVER:** Have write, edit, or delete permissions to my Google Drive. It will use a strictly Read-Only API token.
- **MUST NEVER:** Search the live web to fill in gaps in my notes.

## 7. Platform Choice and Justification
**Platform:** OpenAI Custom GPT (or Claude Project).
**Justification:** I chose to build this as an OpenAI Custom GPT because it provides out-of-the-box support for RAG (Retrieval-Augmented Generation). I can simply upload my knowledge base (my study notes) directly to the GPT without needing to build a complex vector database or use n8n workflows. This guarantees I can complete the project within the 10-hour build limit. Unlike a scripted local agent, a Custom GPT gives me an instant, mobile-friendly chat interface so I can study on the go.
