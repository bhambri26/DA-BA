import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Briefcase, Clock, Github } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [careerPathFilter, setCareerPathFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, difficultyFilter, careerPathFilter]);

  const fetchProjects = async () => {
    try {
      const [projectsRes, progressRes] = await Promise.all([
        axios.get(`${API}/projects`),
        axios.get(`${API}/progress`)
      ]);

      setProjects(projectsRes.data);
      
      const progressMap = {};
      progressRes.data.forEach(p => {
        if (p.item_type === 'project') {
          progressMap[p.item_id] = p;
        }
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(project => project.difficulty === difficultyFilter);
    }

    if (careerPathFilter !== 'all') {
      filtered = filtered.filter(project => project.career_paths?.includes(careerPathFilter));
    }

    setFilteredProjects(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-purple-100 text-purple-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (projectId) => {
    const progress = userProgress[projectId];
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
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4" data-testid="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2" data-testid="page-title">Hands-on Projects</h1>
          <p className="text-gray-600">Build real-world projects to showcase your skills</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 shadow-lg border-0" data-testid="filters-section">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
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
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="projects-grid">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1 group"
              onClick={() => navigate(`/projects/${project.id}`)}
              data-testid={`project-card-${project.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  {getStatusBadge(project.id)}
                </div>
                <CardTitle className="text-xl leading-tight">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.estimated_time}
                  </Badge>
                  {project.github_link && (
                    <Badge variant="outline" className="flex items-center">
                      <Github className="w-3 h-3 mr-1" />
                      GitHub
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500 font-medium">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {project.skills?.slice(0, 4).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills?.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{project.resources?.length || 0} Resources</span>
                    <span className="text-green-600 font-medium group-hover:translate-x-1 transition-transform">
                      Start Project →
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12" data-testid="no-results">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No projects found matching your criteria</p>
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

export default ProjectsPage;
