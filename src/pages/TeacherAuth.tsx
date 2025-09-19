import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GraduationCap, Users, BookOpen, BarChart3, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  subject: string;
  classes: string[];
  joinedAt: Date;
}

export const TeacherAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',
    subject: '',
    className: ''
  });
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>('eco-teachers', []);
  const [, setCurrentTeacher] = useLocalStorage<Teacher | null>('current-teacher', null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      const teacher = teachers.find(t => t.email === formData.email);
      if (teacher) {
        setCurrentTeacher(teacher);
        toast.success(`Welcome back, ${teacher.name}!`);
        navigate('/teacher-dashboard');
      } else {
        toast.error('Teacher not found. Please register first.');
      }
    } else {
      // Register logic
      if (!formData.name || !formData.email || !formData.password || !formData.school || !formData.subject) {
        toast.error('Please fill in all required fields');
        return;
      }

      const existingTeacher = teachers.find(t => t.email === formData.email);
      if (existingTeacher) {
        toast.error('Email already registered. Please login instead.');
        return;
      }

      const newTeacher: Teacher = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        school: formData.school,
        subject: formData.subject,
        classes: formData.className ? [formData.className] : [],
        joinedAt: new Date()
      };

      setTeachers(prev => [...prev, newTeacher]);
      setCurrentTeacher(newTeacher);
      toast.success(`Welcome to EcoLogic, ${newTeacher.name}!`);
      navigate('/teacher-dashboard');
    }
  };

  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Manage Classes',
      description: 'Create and manage multiple classes with student analytics'
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Custom Content',
      description: 'Upload lessons, create quizzes, and assign challenges'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Analytics',
      description: 'Track student progress and engagement metrics'
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'Leaderboards',
      description: 'View class and school-wide environmental impact rankings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-leaf/10 to-eco-growth/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features Section */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              🌱 EcoLogic for Teachers
            </h1>
            <p className="text-xl text-muted-foreground">
              Empower environmental education with interactive tools and real-time student engagement tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="eco-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-eco-leaf">{feature.icon}</div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-eco-leaf/10 rounded-lg border border-eco-leaf/20">
            <h4 className="font-semibold text-eco-leaf mb-2">✨ Coming Soon</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• AI-powered lesson recommendations</li>
              <li>• Automated challenge verification</li>
              <li>• Parent progress reports</li>
              <li>• School-wide impact dashboards</li>
            </ul>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="eco-card">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-eco-leaf to-eco-growth rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center">
              {isLogin ? 'Teacher Login' : 'Teacher Registration'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Access your teacher dashboard and manage your classes' 
                : 'Join EcoLogic and start inspiring environmental change'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium block mb-1">Full Name *</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-1">Email Address *</label>
                <Input
                  type="email"
                  placeholder="teacher@school.edu"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Password *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="text-sm font-medium block mb-1">School Name *</label>
                    <Input
                      type="text"
                      placeholder="Green Valley Elementary"
                      value={formData.school}
                      onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Subject Area *</label>
                    <Input
                      type="text"
                      placeholder="Environmental Science, Biology, etc."
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">First Class Name (Optional)</label>
                    <Input
                      type="text"
                      placeholder="5th Grade Green Team"
                      value={formData.className}
                      onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full">
                {isLogin ? 'Login to Dashboard' : 'Create Teacher Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-eco-leaf hover:underline"
              >
                {isLogin 
                  ? "Don't have an account? Register here" 
                  : "Already have an account? Login here"
                }
              </button>
            </div>

            {/* Demo Account */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <Badge className="mb-2">Demo Account</Badge>
              <p className="text-xs text-muted-foreground">
                Email: demo@teacher.com • Password: demo123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};