
import React, { useState } from 'react';
import { Lesson, LessonComponent, LessonComponentType, InteractiveQuizComponent, Choice } from '../types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import CodeEditor from './CodeEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, Code2, Beaker, HelpCircle } from 'lucide-react';

const LessonComponentWrapper: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 animate__animated animate__fadeInUp">
        <div className="flex items-center text-xl font-bold mb-4 text-primary-600 dark:text-primary-400">
            {icon}
            <h3 className="ml-3">{title}</h3>
        </div>
        <div className="prose dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:text-gray-900 dark:prose-headings:text-gray-100">
            {children}
        </div>
    </div>
);

const QuizComponent: React.FC<{ component: InteractiveQuizComponent }> = ({ component }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<Choice | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSelect = (choice: Choice) => {
        if (!isAnswered) {
            setSelectedAnswer(choice);
            setIsAnswered(true);
        }
    };

    return (
        <LessonComponentWrapper title={component.title} icon={<HelpCircle />}>
            <p className="mb-4 text-lg">{component.question}</p>
            <div className="space-y-3">
                {component.choices.map((choice, index) => {
                    const isCorrect = choice.isCorrect;
                    const isSelected = selectedAnswer?.text === choice.text;
                    let buttonClass = 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700';
                    if (isAnswered && isSelected) {
                        buttonClass = isCorrect ? 'bg-green-100 dark:bg-green-900 border-green-500' : 'bg-red-100 dark:bg-red-900 border-red-500';
                    } else if (isAnswered && isCorrect) {
                         buttonClass = 'bg-green-100 dark:bg-green-900 border-green-500';
                    }

                    return (
                        <button key={index} onClick={() => handleSelect(choice)} disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${buttonClass}`}>
                            <span className="flex-grow">{choice.text}</span>
                            {isAnswered && isSelected && (isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />)}
                        </button>
                    )
                })}
            </div>
            <AnimatePresence>
                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-4 p-4 rounded-lg ${selectedAnswer?.isCorrect ? 'bg-green-50 dark:bg-green-900/50' : 'bg-red-50 dark:bg-red-900/50'}`}
                    >
                        <p className="font-semibold">{selectedAnswer?.isCorrect ? 'Correct!' : 'Not quite.'}</p>
                        <p>{component.explanation}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </LessonComponentWrapper>
    );
};

const AnimationComponentViewer: React.FC = () => {
    const [gravity, setGravity] = useState(9.8);
    const [key, setKey] = useState(0);

    return (
         <LessonComponentWrapper title="Animation Demo" icon={<Beaker />}>
            <p>Observe how changing gravity affects the falling speed. Click the ball to drop it again.</p>
            <div className="my-4 p-4 border rounded-lg dark:border-gray-600">
                <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-md flex justify-center items-end overflow-hidden">
                    <motion.div
                        key={key}
                        className="w-12 h-12 bg-primary-500 rounded-full"
                        initial={{ y: -256 }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 50, mass: gravity / 9.8 }}
                        onClick={() => setKey(prev => prev + 1)}
                    ></motion.div>
                </div>
                <div className="mt-4">
                    <label htmlFor="gravity" className="block text-sm font-medium">Gravity: {gravity.toFixed(1)} m/s²</label>
                    <input id="gravity" type="range" min="1" max="50" value={gravity} onChange={e => setGravity(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" />
                </div>
            </div>
        </LessonComponentWrapper>
    )
}

const LessonContent: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    return (
        <div>
            {lesson.components.map((component, index) => {
                switch (component.type) {
                    case LessonComponentType.Theory:
                        return (
                             <LessonComponentWrapper key={index} title={component.title} icon={<Lightbulb />}>
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{component.content}</ReactMarkdown>
                            </LessonComponentWrapper>
                        );
                    case LessonComponentType.Interactive:
                    case LessonComponentType.Quiz:
                        return <QuizComponent key={index} component={component} />;
                    case LessonComponentType.Practice:
                        return (
                            <LessonComponentWrapper key={index} title={component.title} icon={<Code2 />}>
                                <p className="mb-4">{component.task}</p>
                                <CodeEditor language={component.language} initialCode={component.initialCode} />
                            </LessonComponentWrapper>
                        );
                    case LessonComponentType.Animation:
                        return <AnimationComponentViewer key={index} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default LessonContent;
