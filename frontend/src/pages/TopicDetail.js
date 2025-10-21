import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Clock, Award, ExternalLink, CheckCircle2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [progress, setProgress] = useState(null);
  const [notes, setNotes] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopicData();
  }, [topicId]);

  const fetchTopicData = async () => {
    try {
      const [topicRes, progressRes] = await Promise.all([
        axios.get(`${API}/topics/${topicId}`),
        axios.get(`${API}/progress`)
      ]);

      setTopic(topicRes.data);
      
      const userProgress = progressRes.data.find(
        p => p.item_id === topicId && p.item_type === 'topic'
      );
      
      if (userProgress) {
        setProgress(userProgress);
        setNotes(userProgress.notes || '');
        setProgressPercentage(userProgress.progress_percentage || 0);
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast.error('Failed to load topic details');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (status, percentage) => {
    try {
      await axios.post(`${API}/progress`, {
        item_id: topicId,
        item_type: 'topic',
        status,
        progress_percentage: percentage,
        notes
      });

      toast.success('Progress updated!');
      fetchTopicData();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleStartLearning = () => {
    updateProgress('in_progress', 10);
  };

  const handleMarkComplete = () => {
    updateProgress('completed', 100);
  };

  const handleProgressChange = (value) => {
    setProgressPercentage(value);
    if (value === 100) {
      updateProgress('completed', 100);
    } else if (value > 0) {
      updateProgress('in_progress', value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Topic not found</p>
          <Button onClick={() => navigate('/topics')}>Back to Topics</Button>
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
          <Button variant="ghost" onClick={() => navigate('/topics')} className="mb-4" data-testid="back-btn">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Topics
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-3" data-testid="topic-title">{topic.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {topic.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed" data-testid="topic-description">{topic.description}</p>
              </CardHeader>
              <CardContent>
                {progress?.status === 'completed' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6" data-testid="completed-banner">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold text-green-800">Completed!</p>
                        <p className="text-sm text-green-600">Great job finishing this topic</p>
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
                      onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                      className="w-full"
                      data-testid="progress-slider"
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleStartLearning}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mb-6"
                    data-testid="start-learning-btn"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Learning
                  </Button>
                )}

                {progress && progress.status !== 'completed' && (
                  <Button
                    onClick={handleMarkComplete}
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    data-testid="mark-complete-btn"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}

                {topic.career_paths && topic.career_paths.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Relevant Career Paths</h3>
                    <div className="flex flex-wrap gap-2">
                      {topic.career_paths.map((path, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {path}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {topic.prerequisites && topic.prerequisites.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Prerequisites</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {topic.prerequisites.map((prereq, idx) => (
                        <li key={idx}>{prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {topic.resources && topic.resources.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full" data-testid="resources-accordion">
                    {topic.resources.map((resource, idx) => (
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
                <CardTitle>Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Take notes while learning..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => progress && updateProgress(progress.status, progressPercentage)}
                  rows={8}
                  className="resize-none"
                  data-testid="notes-textarea"
                />
                <p className="text-xs text-gray-500 mt-2">Notes are saved automatically</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resources</span>
                  <span className="font-semibold">{topic.resources?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-semibold">{topic.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Level</span>
                  <span className="font-semibold">{topic.difficulty}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
