import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Zap, Target, Shield, Users, TrendingUp } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import Layout from '@/components/layout/Layout';
const Home: React.FC = () => {
  const benefits = [{
    icon: Zap,
    title: 'Altamente Eficientes',
    description: 'Automatize tarefas que normalmente levariam horas para serem concluídas em apenas minutos, aumentando drasticamente a produtividade.'
  }, {
    icon: Target,
    title: 'Personalizáveis',
    description: 'Adapte cada agente às necessidades específicas do seu negócio, garantindo resultados alinhados com seus objetivos e processos.'
  }, {
    icon: Brain,
    title: 'Aprendizado Contínuo',
    description: 'Nossos agentes melhoram continuamente com o uso, adaptando-se às suas necessidades e aprendendo com cada interação.'
  }, {
    icon: Shield,
    title: 'Segurança Avançada',
    description: 'Projetados com protocolos de segurança de última geração para proteger seus dados e garantir a conformidade regulatória.'
  }, {
    icon: TrendingUp,
    title: 'Análises Detalhadas',
    description: 'Acompanhe o desempenho dos agentes e obtenha insights valiosos sobre processos e resultados através de painéis analíticos intuitivos.'
  }, {
    icon: Users,
    title: 'Integrações Flexíveis',
    description: 'Conecte-se facilmente com suas ferramentas existentes através de APIs intuitivas e integrações nativas com sistemas populares.'
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
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-dark via-nexus-darker to-nexus-light opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nexus-purple/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-nexus-violet/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>
        
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
        
        {/* Logo no topo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <Link to="/" className="flex items-center justify-center space-x-3 hover-scale">
            <span className="text-3xl font-bold gradient-text">Solandox</span>
          </Link>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-20">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Transforme seu Negócio com{' '}
              <span className="gradient-text">Agentes de IA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto lg:mx-0 animate-fade-in">
              Descubra como nossos agentes de IA especializados podem revolucionar 
              sua empresa, otimizar processos e maximizar resultados.
            </p>
            
            <div className="flex justify-center lg:justify-start animate-fade-in">
              <Link to="/agentes">
                <Button className="nexus-button text-lg px-8 py-4 group">
                  Explorar Agentes
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right content - 3D Robot */}
          <div className="relative h-[400px] lg:h-[500px]">
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-20 bg-gradient-to-b from-nexus-dark/30 via-nexus-light/5 to-transparent">
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
            name: 'Agente Comercial (SDR)',
            icon: <Users className="h-8 w-8" />,
            description: 'Automatize prospecção e qualificação de leads. Este agente gerencia o funil de vendas, agenda reuniões e mantém interações personalizadas com potenciais clientes.'
          }, {
            name: 'Agente Clínicas',
            icon: <Target className="h-8 w-8" />,
            description: 'Otimize o gerenciamento de pacientes e consultas. Este agente organiza agendamentos, envia lembretes e facilita a comunicação entre equipe médica e pacientes.'
          }, {
            name: 'Agente Imobiliárias',
            icon: <Brain className="h-8 w-8" />,
            description: 'Transforme a experiência de compra e venda de imóveis. Este agente gerencia listagens, organiza visitas e qualifica leads para corretores, aumentando a eficiência do negócio.'
          }, {
            name: 'Agente Advocacia',
            icon: <Shield className="h-8 w-8" />,
            description: 'Aumente a produtividade do escritório jurídico. Este agente organiza casos, pesquisa jurisprudência e facilita a comunicação com clientes e documentação.'
          }, {
            name: 'Agente Financeiro',
            icon: <TrendingUp className="h-8 w-8" />,
            description: 'Optimize gestão financeira e análise de investimentos. Este agente automatiza relatórios, monitora fluxo de caixa e oferece insights para tomada de decisões estratégicas.'
          }, {
            name: 'Agente Vendedor Infoprodutos',
            icon: <Zap className="h-8 w-8" />,
            description: 'Maximize vendas de produtos digitais e cursos online. Este agente qualifica leads, automatiza funis de venda e personaliza ofertas baseadas no comportamento do cliente.'
          }, {
            name: 'Agente CS',
            icon: <Users className="h-8 w-8" />,
            description: 'Revolucione o atendimento ao cliente com respostas inteligentes 24/7. Este agente resolve dúvidas, escala problemas complexos e mantém histórico completo de interações.'
          }, {
            name: 'Agente Recuperador de Vendas',
            icon: <Target className="h-8 w-8" />,
            description: 'Reconquiste clientes e recupere vendas perdidas. Este agente identifica oportunidades de reengajamento, cria campanhas personalizadas e automatiza follow-ups estratégicos.'
          }, {
            name: 'Agente Recrutamento Pessoal (RH)',
            icon: <Brain className="h-8 w-8" />,
            description: 'Transforme processos de recrutamento e seleção. Este agente filtra currículos, agenda entrevistas, avalia candidatos e automatiza comunicação durante todo o processo seletivo.'
          }, {
            name: 'Agente para Escolas de Ensino',
            icon: <Shield className="h-8 w-8" />,
            description: 'Modernize a gestão educacional e comunicação escolar. Este agente gerencia matrículas, comunica com pais, acompanha desempenho de alunos e automatiza processos administrativos.'
          }, {
            name: 'Agente Terapeuta',
            icon: <Brain className="h-8 w-8" />,
            description: 'Apoie a prática terapêutica com agendamentos inteligentes. Este agente organiza sessões, envia lembretes, gerencia prontuários e facilita comunicação com pacientes.'
          }, {
            name: 'Agente para Psicólogos',
            icon: <Brain className="h-8 w-8" />,
            description: 'Otimize a prática psicológica com gestão automatizada. Este agente agenda consultas, mantém registros seguros, envia lembretes e auxilia na organização de tratamentos.'
          }].map((agent, index) => (
              <div key={index} className="agent-card bg-gradient-to-br from-nexus-darker to-nexus-light border border-nexus-purple/20 rounded-lg p-6 hover:border-nexus-purple/40 flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-nexus-purple to-nexus-violet rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  {agent.icon}
                </div>
                <h3 className="text-lg font-bold mb-4 text-white text-center">{agent.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">{agent.description}</p>
                <Button className="w-full bg-gradient-to-r from-nexus-purple to-nexus-violet text-white font-medium py-2 px-4 rounded-lg hover:from-nexus-violet hover:to-nexus-purple transition-all duration-300 mt-auto">
                  TESTAR AGORA
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-nexus-darker/10 to-nexus-light/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Por que escolher <span className="gradient-text">nossos agentes</span>?
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-nexus-light/5 via-nexus-darker/10 to-nexus-dark/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nexus-card text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para <span className="gradient-text">Revolucionar</span> seu Negócio?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Entre em contato conosco e descubra como a IA pode transformar 
              sua empresa e impulsionar seus resultados.
            </p>
            <div className="flex justify-center">
              <Link to="/agentes">
                <Button className="nexus-button text-lg px-8 py-4 group">
                  Conhecer Soluções
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Home;