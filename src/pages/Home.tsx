import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Zap, Target, Shield, Users, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
const Home: React.FC = () => {
  const benefits = [{
    icon: Brain,
    title: 'IA Especializada',
    description: 'Agentes treinados especificamente para seu setor de negócio'
  }, {
    icon: Zap,
    title: 'Resultados Rápidos',
    description: 'Implementação ágil com resultados visíveis em semanas'
  }, {
    icon: Target,
    title: 'Precisão Máxima',
    description: 'Algoritmos otimizados para máxima eficiência e precisão'
  }, {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Proteção avançada de dados e conformidade regulatória'
  }, {
    icon: Users,
    title: 'Suporte 24/7',
    description: 'Equipe especializada disponível sempre que precisar'
  }, {
    icon: TrendingUp,
    title: 'ROI Comprovado',
    description: 'Retorno sobre investimento demonstrado em todos os projetos'
  }];
  const stats = [{
    number: '500+',
    label: 'Empresas Atendidas'
  }, {
    number: '95%',
    label: 'Taxa de Satisfação'
  }, {
    number: '40%',
    label: 'Redução de Custos'
  }, {
    number: '24/7',
    label: 'Suporte Disponível'
  }];
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-dark via-nexus-darker to-nexus-light opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nexus-purple/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-nexus-violet/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Transforme seu Negócio com{' '}
            <span className="gradient-text">Agentes de IA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
            Descubra como nossos agentes de IA especializados podem revolucionar 
            sua empresa, otimizar processos e maximizar resultados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Link to="/agentes">
              <Button className="nexus-button text-lg px-8 py-4 group">
                Explorar Agentes
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
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-nexus-light/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Por que escolher a <span className="gradient-text">Solando x</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Combinamos tecnologia de ponta com expertise setorial para entregar 
              soluções que realmente fazem a diferença no seu negócio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="nexus-card hover-scale animate-fade-in group">
                <div className="w-12 h-12 bg-purple-gradient rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-20 bg-nexus-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Nossos <span className="gradient-text">Agentes Especializados</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cada agente é desenvolvido com expertise específica para seu setor, 
              garantindo soluções precisas e eficazes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[{
            name: 'Dr. Clinic AI',
            sector: 'Saúde',
            description: 'Gestão inteligente de clínicas médicas'
          }, {
            name: 'Realty AI Pro',
            sector: 'Imobiliário',
            description: 'Otimização de vendas imobiliárias'
          }, {
            name: 'Legal AI Assistant',
            sector: 'Jurídico',
            description: 'Assistente jurídico inteligente'
          }, {
            name: 'FinanceBot AI',
            sector: 'Financeiro',
            description: 'Análise financeira avançada'
          }].map((agent, index) => <div key={index} className="nexus-card hover-scale animate-fade-in text-center">
                <div className="w-16 h-16 bg-accent-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{agent.name}</h3>
                <div className="text-nexus-purple text-sm font-medium mb-2">{agent.sector}</div>
                <p className="text-gray-400 text-sm">{agent.description}</p>
              </div>)}
          </div>
          
          <div className="text-center">
            <Link to="/agentes">
              <Button className="nexus-button text-lg px-8 py-4 group">
                Ver Todos os Agentes
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nexus-card text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para <span className="gradient-text">Revolucionar</span> seu Negócio?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Entre em contato conosco e descubra como a IA pode transformar 
              sua empresa e impulsionar seus resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contato">
                <Button className="nexus-button text-lg px-8 py-4 group">
                  Solicitar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/agentes">
                <Button variant="outline" className="text-lg px-8 py-4 border-nexus-purple text-nexus-purple hover:bg-nexus-purple hover:text-white">
                  Conhecer Soluções
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Home;