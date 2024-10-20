import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Award } from 'lucide-react';

interface AchievementProps {
  achievements: string;
  isEditing: boolean;
  handleRoleDetailsChange: (field: string, value: any) => void;
}

const AchievementComponent: React.FC<AchievementProps> = ({ achievements, isEditing, handleRoleDetailsChange }) => {
  return (
    <TabsContent value="achievements">
      <div className="space-y-4">
        <label className="text-sm font-medium flex items-center mb-2">
          <Award className="mr-2 h-4 w-4" /> Achievements
        </label>
        {isEditing ? (
          <Textarea
            value={achievements || ''}
            onChange={(e) => handleRoleDetailsChange('achievements', e.target.value)}
            placeholder="Enter achievements"
            className="w-full min-h-[200px]"
          />
        ) : (
          <div className="prose max-w-none">
            {achievements ? (
              <p className="text-lg whitespace-pre-line">{achievements}</p>
            ) : (
              <p className="text-lg text-gray-500">No achievements recorded</p>
            )}
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default AchievementComponent;