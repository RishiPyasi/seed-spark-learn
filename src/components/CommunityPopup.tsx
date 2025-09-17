import { ComingSoonDialog } from './ComingSoonDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Trophy, Calendar } from 'lucide-react';

export const CommunityPopup = ({ children }: { children: React.ReactNode }) => {
  return (
    <ComingSoonDialog
      title="Community Hub"
      description="Connect with fellow eco-warriors and share your journey!"
      feature="community discussions, group challenges, and social features"
    >
      {children}
    </ComingSoonDialog>
  );
};