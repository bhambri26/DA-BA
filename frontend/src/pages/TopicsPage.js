import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Filter, BookOpen, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TopicsPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [careerPathFilter, setCareerPathFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [topics, searchQuery, difficultyFilter, careerPathFilter]);

  const fetchTopics = async () => {
    try {
      const [topicsRes, progressRes] = await Promise.all([
        axios.get(`${API}/topics`),
        axios.get(`${API}/progress`)
      ]);

      setTopics(topicsRes.data);
      
      const progressMap = {};
      progressRes.data.forEach(p => {
        if (p.item_type === 'topic') {
          progressMap[p.item_id] = p;
        }
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...topics];

    if (searchQuery) {
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(topic => topic.difficulty === difficultyFilter);
    }

    if (careerPathFilter !== 'all') {
      filtered = filtered.filter(topic => topic.career_paths.includes(careerPathFilter));
    }

    setFilteredTopics(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-purple-100 text-purple-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (topicId) => {
    const progress = userProgress[topicId];
    if (!progress) return null;

    const statusColors = {
      'completed': 'bg-green-500 text-white',
      'in_progress': 'bg-blue-500 text-white',
      'not_started': 'bg-gray-400 text-white'
    };

    return (
      <Badge className={`${statusColors[progress.status]} ml-2`}>
        {progress.status === 'in_progress' ? `${progress.progress_percentage}%` : progress.status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4" data-testid="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2" data-testid="page-title">Learning Topics</h1>
          <p className="text-gray-600">Explore {topics.length} comprehensive topics covering all data career paths</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0" data-testid="filters-section">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger data-testid="difficulty-filter">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={careerPathFilter} onValueChange={setCareerPathFilter}>
                <SelectTrigger data-testid="career-filter">
                  <SelectValue placeholder="All Career Paths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Career Paths</SelectItem>
                  <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                  <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                  <SelectItem value="Data Engineer">Data Engineer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600" data-testid="results-count">
              Showing {filteredTopics.length} of {topics.length} topics
            </div>
          </CardContent>
        </Card>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="topics-grid">
          {filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1 group"
              onClick={() => navigate(`/topics/${topic.id}`)}
              data-testid={`topic-card-${topic.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  {getStatusBadge(topic.id)}
                </div>
                <CardTitle className="text-xl leading-tight">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{topic.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {topic.duration}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500 font-medium">Career Paths:</div>
                  <div className="flex flex-wrap gap-1">
                    {topic.career_paths.slice(0, 2).map((path, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {path}
                      </Badge>
                    ))}
                    {topic.career_paths.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{topic.career_paths.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{topic.resources?.length || 0} Resources</span>
                    <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                      Learn More →
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12" data-testid="no-results">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No topics found matching your criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
                setCareerPathFilter('all');
              }}
              data-testid="clear-filters-btn"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;
