// Gemini Mocked for full frontend flow
// This prevents the "API Key must be set" error in browser environments
// and allows testing the full flow without external API dependencies.

export const getStickyAdvice = async (query: string) => {
  console.log("Mock Gemini Query:", query);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return "I'm wishyoua's local AI assistant! Since we're in 'Frontend-Only' mode, I'm giving you this pre-set (but still very friendly) answer. Wishyoua helps guests record beautiful video memories without any technical friction!";
};

export const getPropertyAdvice = async (query: string) => {
  console.log("Mock Gemini Property Query:", query);
  await new Promise(resolve => setTimeout(resolve, 800));

  return "I can definitely help with your celebration planning! This is a mock response because the app is currently running in full frontend mode.";
};
