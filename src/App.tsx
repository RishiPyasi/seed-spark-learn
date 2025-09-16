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
import { Goals } from "./pages/Goals";
import { Habits } from "./pages/Habits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/gardens" element={<Gardens />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/habits" element={<Habits />} />
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
