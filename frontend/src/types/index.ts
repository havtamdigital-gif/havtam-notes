export type Category = 'HTML' | 'CSS' | 'JavaScript' | 'Web Basics';
export type Level = 'beginner' | 'basic' | 'intermediate';
export type AppMode = 'home' | 'dict' | 'learn' | 'playground' | 'history' | 'ai' | 'code-writer';

export interface CodeParts { html?:string; css?:string; js?:string }

export interface DictItem {
  id:string; term:string; aliases?:string[]; cat:Category; level:Level;
  sourceLesson?:string; desc:string; when:string; code:string;
  codeParts?:CodeParts; lines:string; mistake:string; exercise:string;
  relatedTopics?:string[]; nextTopic?:string;
}

export interface QuizQuestion { q:string; opts:string[]; ans:number; explanation?:string }

export interface Lesson {
  id:number; icon:string; title:string; sub:string; date?:string;
  category:Category|'Mixed'; concepts:string[]; content:string; quiz:QuizQuestion[];
}

export interface CodeAttempt {
  id:string; createdAt:string; html:string; css:string; js:string;
  status:'success'|'error'|'needs_review'; errorMessage?:string; aiFeedback?:string;
  correctedCode?:CodeParts; relatedTopics:string[]; levelEstimate?:string; isFavorite?:boolean;
}

export interface UserProgress {
  completedLessons:number[]; codeAttempts:CodeAttempt[]; searchHistory:string[];
  currentLevel:Level; weakTopics:string[]; badges:string[]; quizResults:Record<string,boolean>;
}

export interface AIMessage { role:'user'|'assistant'; content:string; timestamp:string; codeSnippet?:string }
