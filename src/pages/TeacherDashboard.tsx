import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ComingSoonDialog } from '@/components/ComingSoonDialog';
import { 
  Users, BookOpen, BarChart3, Plus, Settings, Award, 
  FileText, Calendar, MessageSquare, Target, Upload,
  TrendingUp, Star, Trophy, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  subject: string;
  classes: string[];
}

interface ClassData {
  id: string;
  name: string;
  students: number;
  avgPoints: number;
  completionRate: number;
  lastActive: string;
}

export const TeacherDashboard = () => {
  const [currentTeacher] = useLocalStorage<Teacher | null>('current-teacher', null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const navigate = useNavigate();

  if (!currentTeacher) {
    navigate('/teacher-auth');
    return null;
  }

  // Mock data for demonstration
  const classes: ClassData[] = [
    {
      id: '1',
      name: '5th Grade Green Team',
      students: 24,
      avgPoints: 156,
      completionRate: 78,
      lastActive: '2 hours ago'
    },
    {
      id: '2', 
      name: '6th Grade Eco Warriors',
      students: 28,
      avgPoints: 142,
      completionRate: 85,
      lastActive: '1 day ago'
    }
  ];

  const topStudents = [
    { name: 'Emma Chen', points: 340, class: '5th Grade Green Team' },
    { name: 'James Wilson', points: 315, class: '6th Grade Eco Warriors' },
    { name: 'Sophia Rodriguez', points: 298, class: '5th Grade Green Team' },
    { name: 'Liam Park', points: 287, class: '6th Grade Eco Warriors' },
    { name: 'Ava Johnson', points: 276, class: '5th Grade Green Team' }
  ];

  const recentActivity = [
    { student: 'Emma Chen', action: 'Completed Water Conservation Quiz', time: '30 min ago', points: 25 },
    { student: 'James Wilson', action: 'Submitted Recycling Challenge Photo', time: '1 hour ago', points: 15 },
    { student: 'Sophia Rodriguez', action: 'Started Plastic Reduction Goal', time: '2 hours ago', points: 10 },
    { student: 'Liam Park', action: 'Fed Virtual Pet', time: '3 hours ago', points: 5 }
  ];

  const handleComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setShowComingSoon(true);
  };

  const quickActions = [
    { name: 'Create Quiz', icon: <FileText className="w-5 h-5" />, feature: 'Custom Quiz Creator' },
    { name: 'New Challenge', icon: <Target className="w-5 h-5" />, feature: 'Challenge Assignment' },
    { name: 'Upload Lesson', icon: <Upload className="w-5 h-5" />, feature: 'Lesson Upload' },
    { name: 'Class Discussion', icon: <MessageSquare className="w-5 h-5" />, feature: 'Class Discussion Board' },
    { name: 'Schedule Event', icon: <Calendar className="w-5 h-5" />, feature: 'Event Scheduling' },
    { name: 'Send Report', icon: <BarChart3 className="w-5 h-5" />, feature: 'Progress Reports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-leaf/5 to-eco-growth/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {currentTeacher.name}! 👩‍🏫
            </h1>
            <p className="text-muted-foreground">
              {currentTeacher.school} • {currentTeacher.subject}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleComingSoon('Settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button onClick={() => navigate('/')}>
              Back to Student View
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-leaf">{classes.length}</div>
              <div className="text-sm text-muted-foreground">Active Classes</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-eco-growth">
                {classes.reduce((sum, c) => sum + c.students, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                {Math.round(classes.reduce((sum, c) => sum + c.avgPoints, 0) / classes.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Eco-Points</div>
            </CardContent>
          </Card>
          <Card className="eco-card">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {Math.round(classes.reduce((sum, c) => sum + c.completionRate, 0) / classes.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Fast ways to create content and engage with students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col gap-2"
                  onClick={() => handleComingSoon(action.feature)}
                >
                  <div className="text-eco-leaf">{action.icon}</div>
                  <span className="text-xs font-medium">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="students">Top Students</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Class Management</h2>
              <Button onClick={() => handleComingSoon('New Class')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((classData) => (
                <Card key={classData.id} className="eco-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {classData.name}
                      </span>
                      <Badge variant="outline">{classData.students} students</Badge>
                    </CardTitle>
                    <CardDescription>
                      Last active: {classData.lastActive}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Avg Points</div>
                        <div className="text-lg font-semibold text-eco-leaf">{classData.avgPoints}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Completion</div>
                        <div className="text-lg font-semibold text-eco-growth">{classData.completionRate}%</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleComingSoon('Class Details')}>
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleComingSoon('Manage Class')}>
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <h2 className="text-xl font-semibold">Top Performing Students</h2>
            <Card className="eco-card">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {topStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-eco-leaf/10 text-eco-leaf'
                        }`}>
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.class}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-eco-leaf">{student.points}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Student Activity</h2>
            <Card className="eco-card">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium">{activity.student}</div>
                        <div className="text-sm text-muted-foreground">{activity.action}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </div>
                        <Badge className="eco-badge text-xs">+{activity.points} pts</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-xl font-semibold">Class Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Engagement Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <Button onClick={() => handleComingSoon('Analytics Dashboard')}>
                      View Detailed Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="eco-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievement Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Completed Challenges</span>
                      <Badge>124</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes Taken</span>
                      <Badge>89</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Goals Achieved</span>
                      <Badge>67</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Badges Earned</span>
                      <Badge>156</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {showComingSoon && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full eco-card">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">{comingSoonFeature}</h3>
                <p className="text-muted-foreground mb-4">
                  This feature will allow teachers to create custom content, track student progress, and enhance environmental education engagement.
                </p>
                <Button onClick={() => setShowComingSoon(false)} className="w-full">
                  Got it!
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};