import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

interface Opportunity {
  id: number;
  company: string;
  type: 'Internship' | 'Placement';
  role: string;
  description: string;
  compensation: string;
  applied: boolean;
}

const hardcodedOpportunities: Opportunity[] = [
  {
    id: 1,
    company: "Google",
    type: "Internship",
    role: "Software Engineer Intern",
    description: "Join our team for a 3-month summer internship, working on cutting-edge projects.",
    compensation: "$8,000/month",
    applied: false,
  },
  {
    id: 2,
    company: "Microsoft",
    type: "Placement",
    role: "Software Developer",
    description: "Full-time opportunity for graduating students to work on Microsoft's core products.",
    compensation: "$120,000/year",
    applied: false,
  },
  {
    id: 3,
    company: "Amazon",
    type: "Internship",
    role: "Data Science Intern",
    description: "Work with big data and machine learning algorithms in a fast-paced environment.",
    compensation: "$7,500/month",
    applied: false,
  },
  {
    id: 4,
    company: "Apple",
    type: "Placement",
    role: "iOS Developer",
    description: "Join the team that creates innovative apps for millions of users worldwide.",
    compensation: "$130,000/year",
    applied: false,
  },
  {
    id: 5,
    company: "Facebook",
    type: "Internship",
    role: "UI/UX Design Intern",
    description: "Help design the future of social media interfaces and user experiences.",
    compensation: "$7,000/month",
    applied: false,
  },
];

interface PlacementCardProps {
  opportunity: Opportunity;
  onApply: (id: number) => void;
}

const PlacementCard: React.FC<PlacementCardProps> = ({ opportunity, onApply }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <span>{opportunity.company}</span>
        <Badge variant={opportunity.type === 'Internship' ? 'secondary' : 'default'}>
          {opportunity.type}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="font-semibold">{opportunity.role}</p>
      <p className="text-sm text-gray-500">{opportunity.description}</p>
      <p className="mt-2">
        {opportunity.type === 'Internship' ? 'Stipend: ' : 'Package: '}
        <span className="font-semibold">{opportunity.compensation}</span>
      </p>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onApply(opportunity.id)} disabled={opportunity.applied}>
        {opportunity.applied ? 'Applied' : 'Apply Now'}
      </Button>
    </CardFooter>
  </Card>
);

const Placement: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(hardcodedOpportunities);
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleApply = (opportunityId: number) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId ? { ...opp, applied: true } : opp
    ));
    toast.success('Application submitted successfully!');
  };

  const filteredOpportunities = opportunities.filter(opp => 
    activeTab === 'all' || opp.type.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div>
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex space-x-2 mb-4">
          <Tabs.Trigger
            value="all"
            className={`px-3 py-2 rounded-md ${activeTab === 'all' ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'}`}
          >
            All
          </Tabs.Trigger>
          <Tabs.Trigger
            value="placement"
            className={`px-3 py-2 rounded-md ${activeTab === 'placement' ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'}`}
          >
            Placements
          </Tabs.Trigger>
          <Tabs.Trigger
            value="internship"
            className={`px-3 py-2 rounded-md ${activeTab === 'internship' ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'}`}
          >
            Internships
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredOpportunities.map(opportunity => (
          <PlacementCard 
            key={opportunity.id} 
            opportunity={opportunity} 
            onApply={handleApply}
          />
        ))}
      </div>
    </div>
  );
};

export default Placement;
