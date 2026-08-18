# FL-07 Build Log: ZenStudy Agent

## What broke / Bugs encountered
1. **Initial Context Issue:** At first, the GPT kept ignoring my uploaded notes and tried to teach me React concepts using its own broad internet knowledge. 
2. **Scoring Bug:** The agent was initially too lenient, giving me 9/10 for very vague answers.

## What I changed to fix it
1. **Fixing the Context:** I had to uncheck the "Web Browsing" capability in the Custom GPT configuration so it couldn't cheat by searching the web. I also updated the prompt to explicitly say: *"Never hallucinate outside information. If the answer is not in the uploaded document, state that it is not covered."*
2. **Fixing the Scoring:** I added a stricter grading rubric to the prompt, telling it to deduct points if specific technical keywords from the notes were missing.

## Deviations from the FL-06 Spec
- **Google Drive Integration Removed:** In FL-06, I planned to use a live Google Drive read-only integration. However, configuring OAuth scopes for Drive took too long and risked failing the 10-hour build limit. 
- **Alternative Used:** Instead, I simply exported my notes as a single PDF and uploaded it directly into the Custom GPT's "Knowledge" section. This acts as a perfectly functional mock data source without the API overhead, allowing me to prove the core job (quizzing from specific context) works end-to-end.
