import { streamText,tool,UIMessage,InferUITools,UIDataTypes, convertToModelMessages, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import {z} from "zod"
import { searchDoc } from "@/lib/saerch";


const tools = {
  searchKnowBase: tool({
    description: "Search the knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents")
    }),
    execute :async({query}) => {
      try{
        const results = await searchDoc(query , 3 , 0.5)

        if (results.length === 0) {
            return "No relevant information found in the knowledge base."
        }

        const formattedResults = results
        .map((r,i) => `[${i +1 }] ${r.content}`)
        .join("\n\n")

        return formattedResults;

      }catch(err){
        console.log(err,"search error")
        return "Error searching knowledge base"
      }
    }
  })
}

export type chatTools = InferUITools< typeof tools>
export type chatMessage = UIMessage<never , UIDataTypes, chatTools>



export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      tools,
      system: `You are a helpful assistant with access to a knowledge base.
When users ask questions, search the knowledge base for relevant information.
Always search before answering if the question might relate to uploaded documents.
Base your answers on the search results when available. Give concise answers that cover the key points.
If no relevant results are found, let the user know and suggest they upload relevant documents.`,
    
      stopWhen :stepCountIs(2),
});

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);

    return new Response("Failed to stream chat completion", {
      status: 500,
    });
  }
}