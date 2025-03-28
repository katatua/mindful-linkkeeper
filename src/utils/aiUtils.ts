
// Main file that re-exports all AI utilities
import { suggestedDatabaseQuestions, genId } from './ai/constants';
import { 
  getCurrentAIModel, 
  getCurrentAIProvider, 
  getProviderModel, 
  setAIProvider, 
  setAIModel 
} from './ai/settingsManager';
import { 
  extractEnergyKeywords, 
  extractTechnologyKeywords, 
  extractRegionKeywords 
} from './ai/keywordExtractor';
import { classifyDocument } from './ai/documentClassifier';
import type { DocumentToClassify } from './ai/documentClassifier';
import { getEnhancedSystemPrompt } from './ai/promptEnhancer';
import { generateFallbackResponse } from './ai/fallbackResponder';
import { generateResponse } from './ai/responseGenerator';

// Re-export everything
export {
  // Constants
  suggestedDatabaseQuestions,
  genId,
  
  // AI Provider/Model Settings
  getCurrentAIModel,
  getCurrentAIProvider,
  getProviderModel,
  setAIProvider,
  setAIModel,
  
  // Keyword extraction
  extractEnergyKeywords,
  extractTechnologyKeywords,
  extractRegionKeywords,
  
  // Document classification
  type DocumentToClassify,
  classifyDocument,
  
  // Prompt enhancement
  getEnhancedSystemPrompt,
  
  // Fallback responses
  generateFallbackResponse,
  
  // Response generation
  generateResponse
};
