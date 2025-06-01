
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, Brain, Check, Zap, Target, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Agent } from '@/types';
import { agentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AgentDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      loadAgent(slug);
    }
  }, [slug]);

  const loadAgent = async (agentSlug: string) => {
    try {
      setLoading(true);
      const agentData = await agentService.getAgentBySlug(agentSlug);
      if (agentData) {
        setAgent(agentData);
      } else {
        toast({
          title: 'Agente não encontrado',
          description: 'O agente solicitado não foi encontrado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading agent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes do agente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-nexus-light/30 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-nexus-light/30 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-nexus-light/30 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-48 bg-nexus-light/30 rounded"></div>
              <div className="h-48 bg-nexus-light/30 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!agent) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Agente não encontrado</h1>
          <p className="text-gray-400 mb-8">O agente que você está procurando não foi encontrado.</p>
          <Link to="/agentes">
            <Button className="nexus-button">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos Agentes
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="py-8 bg-nexus-light/20 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-nexus-purple">
              Início
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/agentes" className="text-gray-400 hover:text-nexus-purple">
              Agentes
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-white">{agent.name}</span>
          </nav>
        </div>
      </section>

      {/* Agent Header */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.sectors.map((sector, index) => (
                  <Badge key={index} variant="secondary" className="bg-nexus-purple/20 text-nexus-purple">
                    {sector}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                {agent.name}
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 animate-fade-in">
                {agent.shortDescription}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <Link to="/contato" state={{ agentOfInterest: agent.id }}>
                  <Button className="nexus-button text-lg px-8 py-4 group">
                    Solicitar Demonstração
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contato">
                  <Button variant="outline" className="text-lg px-8 py-4 border-nexus-purple text-nexus-purple hover:bg-nexus-purple hover:text-white">
                    Falar com Especialista
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <div className="w-full h-96 bg-accent-gradient rounded-xl flex items-center justify-center shadow-2xl">
                <Brain className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Description */}
      <section className="py-16 bg-nexus-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Sobre o <span className="gradient-text">{agent.name}</span>
            </h2>
            <div className="nexus-card">
              <p className="text-lg text-gray-300 leading-relaxed">
                {agent.longDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features and Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Features */}
            <div className="animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-purple-gradient rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Funcionalidades</h2>
              </div>
              <div className="space-y-4">
                {agent.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-nexus-purple mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-accent-gradient rounded-lg flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Benefícios</h2>
              </div>
              <div className="space-y-4">
                {agent.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-nexus-purple mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-16 bg-nexus-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-purple-gradient rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Setores de Aplicação</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {agent.sectors.map((sector, index) => (
                <div key={index} className="nexus-card text-center px-6 py-4">
                  <span className="text-lg font-medium text-white">{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nexus-card text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para implementar o <span className="gradient-text">{agent.name}</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Entre em contato conosco e descubra como este agente pode transformar 
              seu negócio e impulsionar seus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contato" state={{ agentOfInterest: agent.id }}>
                <Button className="nexus-button text-lg px-8 py-4 group">
                  Solicitar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/agentes">
                <Button variant="outline" className="text-lg px-8 py-4 border-nexus-purple text-nexus-purple hover:bg-nexus-purple hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver Outros Agentes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AgentDetail;
