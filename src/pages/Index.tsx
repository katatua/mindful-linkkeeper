
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">ANI Innovation Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Welcome to the ANI Innovation Platform. Choose an option to continue:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link to="/dashboard">
              <Button className="w-full">View Dashboard</Button>
            </Link>
            <Link to="/assistant">
              <Button className="w-full" variant="outline">AI Assistant</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
