import { ComingSoonDialog } from './ComingSoonDialog';
import { Calculator, TrendingUp, BarChart3, Globe } from 'lucide-react';

export const ImpactPopup = ({ children }: { children: React.ReactNode }) => {
  return (
    <ComingSoonDialog
      title="Impact Calculator"
      description="Calculate and visualize your real environmental impact!"
      feature="detailed impact metrics, carbon footprint tracking, and progress visualization"
    >
      {children}
    </ComingSoonDialog>
  );
};