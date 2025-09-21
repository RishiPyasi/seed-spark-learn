import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  BookOpen, Play, CheckCircle, Clock, Star, 
  Award, Users, Leaf, Lightbulb, Droplets, 
  Recycle, ArrowRight, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'energy' | 'water' | 'waste' | 'nature';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  points: number;
  isCompleted: boolean;
  isLocked: boolean;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      interactive?: {
        type: 'quiz' | 'drag-drop' | 'click-hotspot';
        question: string;
        options: string[];
        correct: number;
      };
    }[];
    conclusion: string;
  };
}

const lessons: Lesson[] = [
  {
    id: '1',
    title: 'What is Environmental Conservation?',
    description: 'Learn the basics of protecting our planet and why it matters for our future.',
    category: 'basics',
    difficulty: 'beginner',
    duration: 15,
    points: 25,
    isCompleted: false,
    isLocked: false,
    content: {
      introduction: "Welcome to your first lesson in environmental conservation! Our planet Earth is our only home, and it's up to all of us to take care of it.",
      sections: [
        {
          title: "What Does Conservation Mean?",
          content: "Environmental conservation means protecting and preserving natural resources, ecosystems, and wildlife for current and future generations. It's like being a guardian of Earth!"
        },
        {
          title: "Why Do We Need to Protect the Environment?",
          content: "Our environment provides everything we need to survive: clean air to breathe, fresh water to drink, food to eat, and materials for shelter. When we protect the environment, we protect ourselves!",
          interactive: {
            type: 'quiz',
            question: "Which of these is NOT something our environment provides us?",
            options: ["Clean air to breathe", "Fresh water to drink", "Video games", "Food to eat"],
            correct: 2
          }
        },
        {
          title: "Simple Ways You Can Help",
          content: "Every small action counts! You can help by turning off lights when you leave a room, not littering, recycling paper and plastic, and learning more about nature."
        }
      ],
      conclusion: "Congratulations! You've learned the basics of environmental conservation. Remember, even small actions can make a big difference when we all work together!"
    }
  },
  {
    id: '2',
    title: 'Energy Conservation at Home',
    description: 'Discover practical ways to save energy in your daily life and reduce your carbon footprint.',
    category: 'energy',
    difficulty: 'beginner',
    duration: 20,
    points: 30,
    isCompleted: false,
    isLocked: false,
    content: {
      introduction: "Energy powers everything in our homes, but using too much energy can harm the environment. Let's learn how to be energy heroes!",
      sections: [
        {
          title: "Where Does Energy Come From?",
          content: "Most energy comes from burning fossil fuels like coal and oil, which creates pollution. Renewable energy from the sun, wind, and water is much cleaner for our planet."
        },
        {
          title: "Energy Vampires in Your Home",
          content: "Some devices use energy even when they're turned off! These 'energy vampires' include TVs, computers, and chargers that stay plugged in.",
          interactive: {
            type: 'quiz',
            question: "What is an 'energy vampire'?",
            options: ["A scary movie character", "A device that uses energy when turned off", "A broken light bulb", "A type of battery"],
            correct: 1
          }
        },
        {
          title: "Easy Energy-Saving Tips",
          content: "Turn off lights when leaving rooms, unplug chargers when not using them, use natural light during the day, and ask your family to use a programmable thermostat."
        }
      ],
      conclusion: "Great job learning about energy conservation! Every time you turn off a light or unplug a device, you're helping protect our planet. Keep up the great work!"
    }
  },
  {
    id: '3',
    title: 'Water: Our Precious Resource',
    description: 'Understand the water cycle and learn how to conserve this vital resource.',
    category: 'water',
    difficulty: 'intermediate',
    duration: 25,
    points: 35,
    isCompleted: false,
    isLocked: true,
    content: {
      introduction: "Water is essential for all life on Earth. Let's explore why water is so important and how we can protect this precious resource.",
      sections: [
        {
          title: "The Amazing Water Cycle",
          content: "Water moves through our environment in a continuous cycle: evaporation from oceans, condensation in clouds, precipitation as rain, and collection in rivers and lakes."
        },
        {
          title: "Why Clean Water Matters",
          content: "Clean water is necessary for drinking, growing food, and maintaining healthy ecosystems. Pollution and waste threaten our water sources.",
          interactive: {
            type: 'quiz',
            question: "What percentage of Earth's water is fresh water suitable for drinking?",
            options: ["70%", "50%", "25%", "Less than 3%"],
            correct: 3
          }
        },
        {
          title: "Water Conservation Heroes",
          content: "Take shorter showers, turn off the tap while brushing teeth, fix leaky faucets, and collect rainwater for watering plants. Every drop counts!"
        }
      ],
      conclusion: "You're now a water conservation expert! Remember, protecting water means protecting life on Earth. Share what you've learned with your family and friends!"
    }
  },
  {
    id: '4',
    title: 'The Art of Recycling',
    description: 'Master the 3 Rs: Reduce, Reuse, Recycle and become a waste reduction expert.',
    category: 'waste',
    difficulty: 'beginner',
    duration: 18,
    points: 30,
    isCompleted: false,
    isLocked: true,
    content: {
      introduction: "Every day, we create waste, but we can be smarter about how we handle it. Let's learn the art of recycling and waste reduction!",
      sections: [
        {
          title: "The 3 Rs Hierarchy",
          content: "Reduce (use less), Reuse (use again), Recycle (make into something new). This order is important - reducing is better than recycling!"
        },
        {
          title: "What Can Be Recycled?",
          content: "Paper, cardboard, plastic bottles, glass jars, and aluminum cans can often be recycled. But they must be clean and sorted correctly!",
          interactive: {
            type: 'quiz',
            question: "Which item should NOT go in the recycling bin?",
            options: ["Clean plastic bottle", "Pizza box with grease", "Aluminum can", "Glass jar"],
            correct: 1
          }
        },
        {
          title: "Creative Reuse Ideas",
          content: "Turn jars into planters, use old t-shirts as cleaning rags, donate toys you've outgrown, and get creative with art projects using recyclable materials!"
        }
      ],
      conclusion: "Fantastic! You're now a recycling champion. Remember, the best waste is the waste we never create. Think before you buy and choose reusable options!"
    }
  }
];

export const Lessons = () => {
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>('completed-lessons', []);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ecoPoints, setEcoPoints] = useLocalStorage('eco-points', 100);
  const navigate = useNavigate();

  const getLessonsWithProgress = () => {
    return lessons.map(lesson => ({
      ...lesson,
      isCompleted: completedLessons.includes(lesson.id),
      isLocked: lesson.id !== '1' && lesson.id !== '2' && !completedLessons.includes((parseInt(lesson.id) - 1).toString())
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return <BookOpen className="w-5 h-5" />;
      case 'energy': return <Lightbulb className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      case 'waste': return <Recycle className="w-5 h-5" />;
      case 'nature': return <Leaf className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-eco-growth text-white';
      case 'intermediate': return 'bg-yellow-500 text-white';
      case 'advanced': return 'bg-red-500 text-white';
      default: return 'bg-eco-growth text-white';
    }
  };

  const startLesson = (lesson: Lesson) => {
    if (lesson.isLocked) return;
    setCurrentLesson(lesson);
    setCurrentSection(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const nextSection = () => {
    if (!currentLesson) return;
    
    if (currentSection < currentLesson.content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      completeLesson();
    }
  };

  const completeLesson = () => {
    if (!currentLesson) return;
    
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons(prev => [...prev, currentLesson.id]);
      setEcoPoints(prev => prev + currentLesson.points);
    }
    
    setCurrentLesson(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
  };

  const lessonsWithProgress = getLessonsWithProgress();
  const completedCount = completedLessons.length;
  const progressPercentage = (completedCount / lessons.length) * 100;

  if (currentLesson) {
    const currentSectionData = currentLesson.content.sections[currentSection];
    const isLastSection = currentSection === currentLesson.content.sections.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-leaf/5 to-eco-growth/5 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setCurrentLesson(null)}
              className="mb-4"
            >
              ← Back to Lessons
            </Button>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">{currentLesson.title}</h1>
              <Progress 
                value={((currentSection + 1) / currentLesson.content.sections.length) * 100} 
                className="w-32"
              />
            </div>
          </div>

          <Card className="eco-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(currentLesson.category)}
                {currentSectionData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-foreground leading-relaxed">
                {currentSectionData.content}
              </div>

              {currentSectionData.interactive && (
                <div className="p-4 bg-eco-leaf/10 rounded-lg border border-eco-leaf/20">
                  <h4 className="font-semibold mb-3 text-eco-leaf">
                    🧠 Interactive Quiz
                  </h4>
                  <p className="mb-4 font-medium">{currentSectionData.interactive.question}</p>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {currentSectionData.interactive.options.map((option, index) => {
                      const isCorrect = index === currentSectionData.interactive!.correct;
                      const isSelected = selectedAnswer === index;
                      
                      let buttonClass = "justify-start text-left h-auto p-3";
                      if (showAnswer) {
                        if (isCorrect) {
                          buttonClass += " bg-eco-growth/20 border-eco-growth text-eco-growth";
                        } else if (isSelected && !isCorrect) {
                          buttonClass += " bg-red-100 border-red-500 text-red-700";
                        }
                      } else if (isSelected) {
                        buttonClass += " bg-eco-leaf/20 border-eco-leaf";
                      }

                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showAnswer}
                        >
                          <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                          {option}
                          {showAnswer && isCorrect && (
                            <CheckCircle className="w-5 h-5 ml-auto text-eco-growth" />
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {showAnswer && (
                    <div className="mt-4 p-3 rounded-lg bg-eco-growth/10 border border-eco-growth/20">
                      <p className="text-sm text-eco-growth">
                        {selectedAnswer === currentSectionData.interactive.correct
                          ? "🎉 Correct! Great job understanding this concept."
                          : "Not quite right, but that's okay! Learning takes practice."
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  Section {currentSection + 1} of {currentLesson.content.sections.length}
                </div>
                
                <Button
                  onClick={nextSection}
                  disabled={currentSectionData.interactive && !showAnswer}
                  className="bg-eco-leaf hover:bg-eco-leaf/90"
                >
                  {isLastSection ? 'Complete Lesson' : 'Next Section'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLastSection && (
            <Card className="eco-card mt-4">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold mb-2">Lesson Complete!</h3>
                <p className="text-muted-foreground mb-4">
                  {currentLesson.content.conclusion}
                </p>
                <Badge className="eco-badge">
                  <Star className="w-4 h-4 mr-1" />
                  +{currentLesson.points} Eco Points
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-leaf/5 to-eco-growth/5 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎓 Interactive Lessons
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about environmental conservation through engaging, interactive lessons
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="eco-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-eco-leaf">{completedCount}</div>
                <div className="text-sm text-muted-foreground">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-eco-growth">{lessons.length}</div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="mt-4" />
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsWithProgress.map((lesson) => (
            <Card key={lesson.id} className={`eco-card cursor-pointer transition-all ${lesson.isLocked ? 'opacity-60' : 'hover:scale-105'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-eco-leaf">
                    {getCategoryIcon(lesson.category)}
                    <Badge className={getDifficultyColor(lesson.difficulty)} variant="secondary">
                      {lesson.difficulty}
                    </Badge>
                  </div>
                  {lesson.isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  ) : lesson.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-eco-growth" />
                  ) : (
                    <Play className="w-5 h-5 text-eco-leaf" />
                  )}
                </div>
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {lesson.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    +{lesson.points} points
                  </span>
                </div>

                <Button
                  onClick={() => startLesson(lesson)}
                  disabled={lesson.isLocked}
                  className="w-full"
                  variant={lesson.isCompleted ? "outline" : "default"}
                >
                  {lesson.isLocked ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Complete previous lessons
                    </>
                  ) : lesson.isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review Lesson
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Lesson
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="eco-card">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-semibold mb-2">More Lessons Coming Soon!</h3>
            <p className="text-muted-foreground mb-4">
              We're working on advanced topics including climate change, renewable energy, 
              biodiversity, and sustainable living practices.
            </p>
            <Button onClick={() => navigate('/teacher-auth')} variant="outline">
              Are you a teacher? Create custom lessons →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};