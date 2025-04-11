// Export base service
export * from './base';

// Export assistant service and types
export { assistantAIService as assistantService } from './assistant.service';
export { AssistantAIService } from './assistant.service';
export type { ChatMessage, Message, OCRRequestData } from './assistant.service';

// Export dictionary service and types
export { dictionaryAIService as dictionaryService } from './dictionary.service';

