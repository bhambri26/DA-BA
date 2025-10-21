import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Trophy, TrendingUp, LogOut, Menu, X, Search, BookMarked, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [progress, setProgress] = useState([]);
  const [recentTopics, setRecentTopics] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, progressRes, topicsRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/progress`),
        axios.get(`${API}/topics`)
      ]);

      setStats(statsRes.data);
      setProgress(progressRes.data);
      
      const inProgressTopics = progressRes.data
        .filter(p => p.item_type === 'topic' && p.status === 'in_progress')
        .slice(0, 3);
      
      const topicDetails = await Promise.all(
        inProgressTopics.map(p => axios.get(`${API}/topics/${p.item_id}`))
      );
      
      setRecentTopics(topicDetails.map((res, idx) => ({
        ...res.data,
        progress: inProgressTopics[idx].progress_percentage
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const NavLinks = () => (
    <>
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="justify-start" data-testid="nav-dashboard">
        <Target className="w-4 h-4 mr-2" /> Dashboard
      </Button>
      <Button variant="ghost" onClick={() => navigate('/topics')} className="justify-start" data-testid="nav-topics">
        <BookOpen className="w-4 h-4 mr-2" /> Topics
      </Button>
      <Button variant="ghost" onClick={() => navigate('/projects')} className="justify-start" data-testid="nav-projects">
        <Briefcase className="w-4 h-4 mr-2" /> Projects
      </Button>
      <Button variant="ghost" onClick={() => navigate('/admin')} className="justify-start" data-testid="nav-admin">
        <BookMarked className="w-4 h-4 mr-2" /> Admin
      </Button>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" data-testid="app-title">
                DataPath Hub
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLinks />
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-600" data-testid="user-email">{user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout} data-testid="logout-btn">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-btn"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              <NavLinks />
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">{user?.email}</p>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" data-testid="welcome-message">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Continue your learning journey where you left off</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="stats-section">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Completed Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold" data-testid="completed-topics">{stats?.completed_topics || 0}</div>
                  <p className="text-sm opacity-75">of {stats?.total_topics || 0} topics</p>
                </div>
                <BookOpen className="w-10 h-10 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Projects Done</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold" data-testid="completed-projects">{stats?.completed_projects || 0}</div>
                  <p className="text-sm opacity-75">of {stats?.total_projects || 0} projects</p>
                </div>
                <Trophy className="w-10 h-10 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold" data-testid="in-progress">{stats?.total_in_progress || 0}</div>
                  <p className="text-sm opacity-75">active learning</p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold" data-testid="total-completed">{stats?.total_completed || 0}</div>
                  <p className="text-sm opacity-75">items completed</p>
                </div>
                <Target className="w-10 h-10 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTopics.length > 0 ? (
                  <div className="space-y-4" data-testid="recent-topics">
                    {recentTopics.map((topic) => (
                      <div
                        key={topic.id}
                        className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all border border-blue-200"
                        onClick={() => navigate(`/topics/${topic.id}`)}
                        data-testid={`recent-topic-${topic.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{topic.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{topic.difficulty}</Badge>
                              <Badge variant="outline">{topic.duration}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold text-blue-600">{topic.progress}%</span>
                          </div>
                          <Progress value={topic.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="no-progress">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No topics in progress yet</p>
                    <Button onClick={() => navigate('/topics')} data-testid="browse-topics-btn">
                      Browse Topics
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/topics')}
                  data-testid="explore-topics-btn"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore All Topics
                </Button>
                <Button
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => navigate('/projects')}
                  data-testid="view-projects-btn"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Projects
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin')}
                  data-testid="admin-panel-btn"
                >
                  <BookMarked className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </CardContent>
            </Card>

            {/* Career Path Progress */}
            <Card className="shadow-lg border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-semibold">
                      {stats ? Math.round((stats.total_completed / (stats.total_topics + stats.total_projects)) * 100) : 0}%
                    </span>
                  </div>
                  <Progress
                    value={stats ? (stats.total_completed / (stats.total_topics + stats.total_projects)) * 100 : 0}
                    className="h-2"
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Keep up the great work! 🎉</p>
                  <p className="text-xs text-gray-500">
                    You're making excellent progress on your data career journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
