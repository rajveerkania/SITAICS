import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "@/components/magicui/number-ticker";

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">
        <NumberTicker value={Number(value)} />
      </p>
    </CardContent>
  </Card>
);
