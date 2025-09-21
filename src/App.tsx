import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import { Gardens } from "./pages/Gardens";
import { Profile } from "./pages/Profile";
import { Shop } from "./pages/Shop";
import { Challenges } from "./pages/Challenges";
import { Quiz } from "./pages/Quiz";
import { PetDetail } from "./pages/PetDetail";
import { Habits } from "./pages/Habits";
import { Journal } from "./pages/Journal";
import { TeacherAuth } from "./pages/TeacherAuth";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { Lessons } from "./pages/Lessons";
import { Meditation } from "./pages/Meditation";
import { Pomodoro } from "./pages/Pomodoro";
import NotFound from "./pages/NotFound";
import { VerdantChatbot } from "./components/VerdantChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <VerdantChatbot />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/gardens" element={<Gardens />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/pets" element={<PetDetail />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/teacher-auth" element={<TeacherAuth />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          {/* Backend features require Supabase integration */}
          <Route path="/community" element={<div className="p-8 text-center">🤝 Community features require Supabase backend integration</div>} />
          <Route path="/impact" element={<div className="p-8 text-center">📊 Impact analytics require Supabase backend integration</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
