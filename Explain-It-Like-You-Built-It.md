### My Submission: Explain It Like You Built It (Streaming Chat)

The part of my ZenFlow app that I found most interesting to build was the **Streaming Chat** feature. 

Before building this, I thought chatbots worked like a regular web page: you send a message, the server thinks about it for 10 seconds, and then it sends the whole complete paragraph back at once. But if you do that, the user just stares at a spinning loading wheel, which feels super slow and annoying.

To fix this, I used the Vercel AI SDK to stream the data. Here's how it works: instead of waiting for the AI model to finish its entire thought, the backend sends the text back to my frontend piece-by-piece, literally word-by-word, the exact millisecond the AI generates it. On the frontend, I used a React hook called `useChat`. This hook keeps an open connection to the server and constantly updates the React state every time a new tiny chunk of text arrives. Because React automatically updates the screen whenever its state changes, the text appears to "type out" live on the screen for the user. 

It's essentially like a long, continuous water pipe being kept open between the server and the browser, rather than filling up a bucket on the server and handing the whole heavy bucket over at once!
