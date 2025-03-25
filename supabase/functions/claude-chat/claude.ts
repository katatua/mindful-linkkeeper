
import { ANTHROPIC_API_KEY } from "./utils.ts";

// Helper function to send chunk to the stream
export async function sendChunk(writer: WritableStreamDefaultWriter, encoder: TextEncoder, data: any) {
  const json = JSON.stringify(data);
  await writer.write(encoder.encode(`data: ${json}\n\n`));
}

export async function handleClaudeStream(
  userMessage: string,
  chatHistory: any[],
  thinkingEnabled: boolean,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder
) {
  try {
    // Format messages for Claude API
    const messages = formatMessages(chatHistory, userMessage);
    
    // Prepare the request to Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 20000,
        stream: true,
        thinking: thinkingEnabled ? {
          type: "enabled",
          budget_tokens: 16000
        } : undefined,
        messages: messages
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    // Process the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let buffer = "";
    let accumulatedResponse = { text: "", thinking: "" };
    
    // Send initial event to indicate streaming has started
    await sendChunk(writer, encoder, { 
      type: "stream_start", 
      model: "claude-3-7-sonnet-20250219"
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process SSE format (each event is separated by double newlines)
      const events = buffer.split("\n\n");
      buffer = events.pop() || ""; // Keep the last incomplete chunk in buffer
      
      for (const event of events) {
        if (!event.trim()) continue;
        
        const lines = event.split("\n");
        const eventType = lines[0].substring(7); // Remove "event: "
        const dataLine = lines.find(line => line.startsWith("data: "));
        
        if (!dataLine) continue;
        
        try {
          const data = JSON.parse(dataLine.substring(6)); // Remove "data: "
          
          // Process different event types from Claude API
          if (eventType === "message_start") {
            // Message started
          } else if (eventType === "content_block_delta" && data.delta.type === "thinking_delta") {
            // Thinking content
            accumulatedResponse.thinking += data.delta.thinking;
            await sendChunk(writer, encoder, { 
              type: "thinking", 
              content: data.delta.thinking 
            });
          } else if (eventType === "content_block_delta" && data.delta.type === "text_delta") {
            // Text content
            accumulatedResponse.text += data.delta.text;
            await sendChunk(writer, encoder, { 
              type: "text", 
              content: data.delta.text 
            });
          } else if (eventType === "message_delta" && data.delta.stop_reason === "end_turn") {
            // End of message
            await sendChunk(writer, encoder, { 
              type: "stream_end",
              response: accumulatedResponse.text,
              thinking: accumulatedResponse.thinking
            });
          }
        } catch (e) {
          console.error("Error parsing SSE data:", e);
        }
      }
    }
    
  } catch (error) {
    console.error("Error in Claude streaming:", error);
    await sendChunk(writer, encoder, { 
      type: "error", 
      error: error.message 
    });
  } finally {
    // Ensure the stream is closed
    await writer.close();
  }
}

// Format messages for Claude API
function formatMessages(chatHistory: any[], currentMessage: string) {
  // Create initial messages array
  const formattedMessages = [];
  
  // Add chat history
  for (const msg of chatHistory) {
    formattedMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }
  
  // Add the current user message
  formattedMessages.push({
    role: 'user',
    content: currentMessage
  });
  
  return formattedMessages;
}
