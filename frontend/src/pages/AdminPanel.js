import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4" data-testid="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2" data-testid="page-title">Admin Panel</h1>
          <p className="text-gray-600">Manage topics, projects, and learning content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">20</div>
                      <p className="text-sm text-gray-600 mt-2">Across all difficulty levels</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-green-600">10</div>
                      <p className="text-sm text-gray-600 mt-2">Hands-on practical projects</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Career Paths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-purple-600">4</div>
                      <p className="text-sm text-gray-600 mt-2">Complete learning paths</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600 mb-4">
                      The admin panel allows you to manage all learning content. You can add new topics,
                      create projects, edit resources, and organize content by career paths.
                    </p>
                    <Button className="w-full" disabled>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Topic (Coming Soon)
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Project (Coming Soon)
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="topics" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Topics Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Topic management functionality allows you to create, edit, and organize learning topics.
                      All topics are currently managed via the seed script.
                    </p>
                    <Button onClick={() => navigate('/topics')} data-testid="view-topics-btn">
                      View All Topics
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="projects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Project management allows you to create and manage hands-on projects for learners.
                      All projects are currently managed via the seed script.
                    </p>
                    <Button onClick={() => navigate('/projects')} data-testid="view-projects-btn">
                      View All Projects
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
