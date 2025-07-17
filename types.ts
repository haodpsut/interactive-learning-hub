export enum LessonComponentType {
  Theory = 'theory',
  Animation = 'animation',
  Interactive = 'interactive',
  Practice = 'practice',
  Quiz = 'quiz',
}

export interface TheoryComponent {
  type: LessonComponentType.Theory;
  title: string;
  content: string; // Markdown content
}

export interface AnimationComponent {
  type: LessonComponentType.Animation;
  title: string;
  animationType: 'gravity-fall';
  description: string;
}

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface InteractiveQuizComponent {
  type: LessonComponentType.Interactive | LessonComponentType.Quiz;
  title:string;
  question: string;
  choices: Choice[];
  explanation: string;
}

export interface CodeLabComponent {
  type: LessonComponentType.Practice;
  title: string;
  language: 'javascript' | 'html';
  initialCode: string;
  task: string;
}

export type LessonComponent = TheoryComponent | AnimationComponent | InteractiveQuizComponent | CodeLabComponent;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  components: LessonComponent[];
}
