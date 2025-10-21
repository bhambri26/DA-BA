import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, TrendingUp, Award, Users, Zap, ArrowRight, CheckCircle2, Brain, Code, Database, BarChart3 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleEmergentLogin = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleFirebaseLogin = () => {
    // Firebase login will be implemented when user provides credentials
    alert('Firebase authentication requires configuration. Please use Emergent Auth for now.');
  };

  const careerPaths = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Data Analyst',
      description: 'Master data visualization, SQL, and business intelligence',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Business Analyst',
      description: 'Excel at requirements gathering and business metrics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Data Engineer',
      description: 'Build scalable data pipelines and infrastructure',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Data Scientist',
      description: 'Apply ML and advanced analytics to solve problems',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: '20+ Comprehensive Topics',
      description: 'From beginner to advanced, covering all essential skills'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: '10+ Hands-on Projects',
      description: 'Real-world projects to build your portfolio'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Progress Tracking',
      description: 'Continue from where you left off, every time'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Curated Resources',
      description: 'Best courses from Coursera, Udemy, LinkedIn & more'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Multiple Career Paths',
      description: 'Choose your journey: Analyst, Engineer, or Scientist'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Interview Ready',
      description: 'Practice questions and projects for job interviews'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200" data-testid="beta-badge">
              <Zap className="w-4 h-4 mr-2 inline" />
              Your Complete Data Career Learning Platform
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Master Data Skills,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Launch Your Career
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              A comprehensive PWA platform with 20+ topics, 10+ projects, and curated resources 
              from top platforms. Continue learning exactly where you left off.
            </p>
            
            {!showAuthChoice ? (
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowAuthChoice(true)}
                data-testid="get-started-btn"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-testid="auth-choice-section">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full shadow-lg"
                  onClick={handleEmergentLogin}
                  data-testid="emergent-login-btn"
                >
                  Login with Emergent (Google)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-full"
                  onClick={handleFirebaseLogin}
                  data-testid="firebase-login-btn"
                >
                  Login with Firebase
                </Button>
              </div>
            )}
          </div>

          {/* Career Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" data-testid="career-paths-section">
            {careerPaths.map((path, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
                data-testid={`career-path-${index}`}
              >
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${path.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {path.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                  <p className="text-gray-600 text-sm">{path.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600">Comprehensive resources, all in one place</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-transparent hover:border-blue-200"
                data-testid={`feature-${index}`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white" data-testid="stats-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-topics">
              <div className="text-5xl font-bold mb-2">20+</div>
              <div className="text-blue-100">Learning Topics</div>
            </div>
            <div data-testid="stat-projects">
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Real Projects</div>
            </div>
            <div data-testid="stat-paths">
              <div className="text-5xl font-bold mb-2">4</div>
              <div className="text-blue-100">Career Paths</div>
            </div>
            <div data-testid="stat-resources">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Free Resources</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of learners mastering data skills with our curated platform
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-lg rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            onClick={() => setShowAuthChoice(true)}
            data-testid="cta-button"
          >
            Start Learning Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
