import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Clock, ExternalLink, CheckCircle2, PlayCircle, Github, Award } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(null);
  const [notes, setNotes] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, progressRes] = await Promise.all([
        axios.get(`${API}/projects/${projectId}`),
        axios.get(`${API}/progress`)
      ]);

      setProject(projectRes.data);
      
      const userProgress = progressRes.data.find(
        p => p.item_id === projectId && p.item_type === 'project'
      );
      
      if (userProgress) {
        setProgress(userProgress);
        setNotes(userProgress.notes || '');
        setProgressPercentage(userProgress.progress_percentage || 0);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (status, percentage) => {
    try {
      await axios.post(`${API}/progress`, {
        item_id: projectId,
        item_type: 'project',
        status,
        progress_percentage: percentage,
        notes
      });

      toast.success('Progress updated!');
      fetchProjectData();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-blue-100 text-blue-700',
      'Advanced': 'bg-purple-100 text-purple-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-4" data-testid="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h1 className="text-3xl font-bold mb-3" data-testid="project-title">{project.title}</h1>
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
                      GitHub Available
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed" data-testid="project-description">{project.description}</p>
              </CardHeader>
              <CardContent>
                {progress?.status === 'completed' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6" data-testid="completed-banner">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-800">Project Completed!</p>
                        <p className="text-sm text-green-600">Excellent work on finishing this project</p>
                      </div>
                    </div>
                  </div>
                ) : progress?.status === 'in_progress' ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm font-semibold text-blue-600" data-testid="progress-percentage">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 mb-2" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressPercentage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setProgressPercentage(val);
                        updateProgress(val === 100 ? 'completed' : 'in_progress', val);
                      }}
                      className="w-full"
                      data-testid="progress-slider"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => updateProgress('in_progress', 10)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white mb-6"
                    data-testid="start-project-btn"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Project
                  </Button>
                )}

                {progress && progress.status !== 'completed' && (
                  <Button
                    onClick={() => updateProgress('completed', 100)}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 mb-6"
                    data-testid="mark-complete-btn"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}

                {project.github_link && (
                  <Button
                    variant="outline"
                    className="w-full mb-6"
                    onClick={() => window.open(project.github_link, '_blank')}
                    data-testid="github-link-btn"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                )}

                {project.skills && project.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Skills You'll Learn</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {project.career_paths && project.career_paths.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Relevant For</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.career_paths.map((path, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {path}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Project Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {project.resources && project.resources.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full" data-testid="resources-accordion">
                    {project.resources.map((resource, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-medium">{resource.title}</span>
                            <div className="flex items-center space-x-2">
                              <Badge variant={resource.type === 'FREE' ? 'default' : 'secondary'}>
                                {resource.type}
                              </Badge>
                              <Badge variant="outline">{resource.platform}</Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-between"
                              onClick={() => window.open(resource.url, '_blank')}
                              data-testid={`resource-link-${idx}`}
                            >
                              <span>Open Resource</span>
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-gray-500 text-center py-4">No resources available yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Project Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Document your progress, challenges, and learnings..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => progress && updateProgress(progress.status, progressPercentage)}
                  rows={10}
                  className="resize-none"
                  data-testid="notes-textarea"
                />
                <p className="text-xs text-gray-500 mt-2">Notes are saved automatically</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Project Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Estimated Time</span>
                  <span className="font-semibold">{project.estimated_time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulty</span>
                  <span className="font-semibold">{project.difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resources</span>
                  <span className="font-semibold">{project.resources?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Skills</span>
                  <span className="font-semibold">{project.skills?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
