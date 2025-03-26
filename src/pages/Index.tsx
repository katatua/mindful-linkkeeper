
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DatabaseConnectionTest from "@/components/DatabaseConnectionTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8">
        <img 
          src="https://via.placeholder.com/50?text=ANI" 
          alt="ANI Logo" 
          className="h-12 w-12 rounded" 
        />
        <h1 className="text-2xl font-bold">ANI Innovation Platform</h1>
      </div>
      
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 mb-4">
            Welcome to the ANI Innovation Platform. First, let's check the database connection status.
          </p>
          
          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-2">Database Connection</h3>
            <DatabaseConnectionTest />
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
            <Link to="/portal">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link to="/database-management">
              <Button variant="outline" className="w-full">Database Management</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
