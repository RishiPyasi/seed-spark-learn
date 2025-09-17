import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { CheckCircle, XCircle, Brain, Trophy, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: '1',
    question: 'Which gas is primarily responsible for global warming?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
    correctAnswer: 1,
    explanation: 'Carbon dioxide (CO2) is the main greenhouse gas contributing to global warming.',
    points: 10
  },
  {
    id: '2',
    question: 'How long does it take for a plastic bottle to decompose?',
    options: ['10 years', '50 years', '100 years', '450 years'],
    correctAnswer: 3,
    explanation: 'Plastic bottles can take up to 450 years to fully decompose in the environment.',
    points: 15
  },
  {
    id: '3',
    question: 'Which renewable energy source is most widely used globally?',
    options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
    correctAnswer: 2,
    explanation: 'Hydroelectric power is currently the most widely used renewable energy source worldwide.',
    points: 10
  },
  {
    id: '4',
    question: 'What percentage of Earth\'s water is freshwater?',
    options: ['50%', '25%', '10%', '3%'],
    correctAnswer: 3,
    explanation: 'Only about 3% of Earth\'s water is freshwater, making it a precious resource.',
    points: 20
  },
  {
    id: '5',
    question: 'Which activity saves the most water?',
    options: ['Shorter showers', 'Fixing leaks', 'Full dishwasher loads', 'All equally important'],
    correctAnswer: 3,
    explanation: 'All these activities are equally important for water conservation!',
    points: 15
  }
];

export const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(QUIZ_QUESTIONS.length).fill(false));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { addPoints } = useEcoPoints();

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  // Play sound effect (mock implementation)
  const playSound = (type: 'correct' | 'incorrect') => {
    // In a real implementation, you would play actual sound files
    if (type === 'correct') {
      // Play success sound
      console.log('🎵 Playing correct answer sound');
    } else {
      // Play error sound  
      console.log('🎵 Playing incorrect answer sound');
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      addPoints(currentQuestion.points, `Correct quiz answer: ${currentQuestion.question.slice(0, 30)}...`);
      playSound('correct');
      toast.success('🎉 Correct!', {
        description: `+${currentQuestion.points} eco-points earned!`
      });
    } else {
      playSound('incorrect');
      toast.error('❌ Incorrect', {
        description: 'Better luck next time!'
      });
    }

    // Mark this question as answered
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      const totalPoints = correctAnswers * 10 + (selectedAnswer === currentQuestion.correctAnswer ? currentQuestion.points : 0);
      toast.success('🏆 Quiz Completed!', {
        description: `You got ${correctAnswers + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)}/${QUIZ_QUESTIONS.length} correct!`
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setAnsweredQuestions(new Array(QUIZ_QUESTIONS.length).fill(false));
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const finalScore = correctAnswers + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
    const percentage = (finalScore / QUIZ_QUESTIONS.length) * 100;
    
    return (
      <div className="space-y-6">
        <Card className="eco-card text-center">
          <CardHeader>
            <div className="mx-auto mb-4 text-6xl animate-bounce-soft">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎉' : '💪'}
            </div>
            <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
            <CardDescription className="text-lg">
              Great job on testing your environmental knowledge!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-eco-growth">{finalScore}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eco-leaf">{Math.round(percentage)}%</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{finalScore * 10}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button onClick={resetQuiz} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Take Quiz Again
              </Button>
              <Button variant="outline" className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Learn More About Environment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🧠 Environmental Quiz</h1>
        <p className="text-muted-foreground">Test your knowledge and earn eco-points!</p>
      </div>

      {/* Progress Bar */}
      <Card className="eco-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="eco-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            <Badge className="eco-badge">
              <Trophy className="w-3 h-3 mr-1" />
              {currentQuestion.points} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 rounded-lg border transition-all duration-300 ";
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800 animate-pulse";
                } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800 animate-pulse";
                } else {
                  buttonClass += "border-muted bg-muted/30 text-muted-foreground";
                }
              } else {
                if (selectedAnswer === index) {
                  buttonClass += "border-eco-leaf bg-eco-leaf/10 text-eco-leaf scale-105";
                } else {
                  buttonClass += "border-border hover:border-eco-leaf hover:bg-eco-leaf/5 hover:scale-102";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      showResult && index === currentQuestion.correctAnswer 
                        ? 'bg-green-500 border-green-500' 
                        : showResult && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer
                        ? 'bg-red-500 border-red-500'
                        : selectedAnswer === index 
                        ? 'bg-eco-leaf border-eco-leaf' 
                        : 'border-muted-foreground'
                    }`}>
                      {showResult && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                      {showResult && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="p-4 rounded-lg bg-eco-leaf/10 border border-eco-leaf/20 animate-fade-in">
              <h4 className="font-semibold text-eco-leaf mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}
              </h4>
              <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex gap-3">
            {!showResult ? (
              <Button 
                onClick={handleSubmitAnswer} 
                className="flex-1" 
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="flex-1">
                {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card className="eco-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-2">Progress:</span>
            {QUIZ_QUESTIONS.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all ${
                  index < currentQuestionIndex 
                    ? 'bg-eco-growth' 
                    : index === currentQuestionIndex 
                    ? 'bg-eco-leaf animate-pulse' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};