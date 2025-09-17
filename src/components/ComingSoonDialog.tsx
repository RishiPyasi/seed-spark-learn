import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles } from 'lucide-react';

interface ComingSoonDialogProps {
  title: string;
  description: string;
  feature: string;
  children: React.ReactNode;
}

export const ComingSoonDialog = ({ title, description, feature, children }: ComingSoonDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="eco-card max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl animate-bounce-soft">
            <Sparkles className="w-16 h-16 text-eco-leaf" />
          </div>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-lg">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="text-center p-4 bg-eco-leaf/10 rounded-lg border border-eco-leaf/20">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-eco-leaf" />
            <p className="font-medium text-eco-leaf">Coming Soon!</p>
            <p className="text-sm text-muted-foreground mt-1">
              We're working hard to bring you {feature}. Stay tuned for updates!
            </p>
          </div>
          <Button className="w-full" variant="outline">
            🔔 Notify Me When Ready
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};