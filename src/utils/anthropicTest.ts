
/**
 * Utility to test the Anthropic API connection
 * This uses a simple request to verify connectivity
 */
export const testAnthropicConnection = async (apiKey: string): Promise<{
  success: boolean;
  response?: any;
  error?: string;
}> => {
  try {
    // First check if we're in a browser environment where we need to use a proxy
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
      // In the browser, we need to use a server-side proxy to avoid CORS issues
      const response = await fetch('/api/test-anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `Error: ${response.status} ${response.statusText}`
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        response: data
      };
    } else {
      // In a server environment, we can use the Anthropic API directly
      // Note: This would require the Anthropic SDK to be installed
      try {
        // Import dynamically to avoid issues in browser environments
        const { Anthropic } = await import('@anthropic-ai/sdk');
        
        const anthropic = new Anthropic({
          apiKey // Use the provided API key
        });
        
        const msg = await anthropic.messages.create({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 1024,
          messages: [{ role: "user", content: "Hello, Claude" }],
        });
        
        return {
          success: true,
          response: msg
        };
      } catch (importError: any) {
        return {
          success: false,
          error: `Failed to import Anthropic SDK: ${importError.message}. Make sure @anthropic-ai/sdk is installed.`
        };
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || String(error)
    };
  }
};
