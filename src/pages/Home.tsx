import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Zap, Target, Shield, Users, TrendingUp } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Mic, MicOff, X } from 'lucide-react';
const Home: React.FC = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{name: string, type: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text: string, audio?: string, time: string, isUser: boolean}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleTestAgent = (agentName: string, agentType: string) => {
    setSelectedAgent({ name: agentName, type: agentType });
    setIsChatOpen(true);
    // Mensagem inicial do bot
    setMessages([{
      id: 1,
      text: `Olá! Sou o ${agentName}. Como posso ajudá-lo hoje?`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isUser: false
    }]);
  };

  

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedAgent) return;

    const messageToSend = currentMessage;
    setCurrentMessage('');

    const newMessage = {
      id: Date.now(),
      text: messageToSend,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setMessages(prev => [...prev, newMessage]);

    // Chamar webhook com a mensagem do usuário
    try {
      const webhookData = {
        agent_name: selectedAgent.name,
        agent_type: selectedAgent.type,
        action: 'chat_message',
        message: messageToSend,
        timestamp: new Date().toISOString(),
        source: 'portfolio_website'
      };

      const response = await fetch('https://webhook.dev.solandox.com/webhook/portfolio_virtual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        // Processar resposta do webhook
        const webhookResponse = await response.json();
        console.log('Resposta do webhook:', webhookResponse);
        
        // Verificar se há uma resposta do agente no webhook
        let agentMessage = "Obrigado pela sua mensagem! Em breve um de nossos especialistas entrará em contato com você.";
        
        // Verificar diferentes formatos de resposta
        if (webhookResponse.agent_response) {
          agentMessage = webhookResponse.agent_response;
        } else if (webhookResponse.message) {
          agentMessage = webhookResponse.message;
        } else if (webhookResponse.response) {
          agentMessage = webhookResponse.response;
        } else if (Array.isArray(webhookResponse) && webhookResponse.length > 0) {
          // Caso seja um array como retornado: [{"output": "mensagem"}]
          const firstItem = webhookResponse[0];
          if (firstItem && firstItem.output) {
            agentMessage = firstItem.output;
          }
        } else if (webhookResponse.output) {
          // Caso seja um objeto direto com output
          agentMessage = webhookResponse.output;
        }
        
        // Adicionar resposta do bot
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: agentMessage,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isUser: false
          }]);
        }, 1000);
      } else {
        console.error('Erro na resposta do webhook:', response.status, response.statusText);
        throw new Error('Falha na requisição');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Adicionar mensagem de erro no chat
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Desculpe, ocorreu um erro. Tente novamente em alguns instantes.",
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isUser: false
        }]);
      }, 500);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newMessage = {
          id: messages.length + 1,
          text: '',
          audio: audioUrl,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isUser: true
        };

        setMessages(prev => [...prev, newMessage]);
        
        // Chamar webhook com áudio
        try {
          const webhookData = {
            agent_name: selectedAgent?.name,
            agent_type: selectedAgent?.type,
            action: 'chat_audio',
            message: 'Áudio enviado pelo usuário',
            timestamp: new Date().toISOString(),
            source: 'portfolio_website'
          };

          const response = await fetch('https://webhook.dev.solandox.com/webhook/portfolio_virtual', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
          });

          if (response.ok) {
            // Processar resposta do webhook para áudio
            const webhookResponse = await response.json();
            console.log('Resposta do webhook para áudio:', webhookResponse);
            
            let agentMessage = "Recebi seu áudio! Nossa equipe analisará e retornará em breve.";
            
            // Verificar diferentes formatos de resposta
            if (webhookResponse.agent_response) {
              agentMessage = webhookResponse.agent_response;
            } else if (webhookResponse.message) {
              agentMessage = webhookResponse.message;
            } else if (webhookResponse.response) {
              agentMessage = webhookResponse.response;
            } else if (Array.isArray(webhookResponse) && webhookResponse.length > 0) {
              // Caso seja um array como retornado: [{"output": "mensagem"}]
              const firstItem = webhookResponse[0];
              if (firstItem && firstItem.output) {
                agentMessage = firstItem.output;
              }
            } else if (webhookResponse.output) {
              // Caso seja um objeto direto com output
              agentMessage = webhookResponse.output;
            }
            
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: agentMessage,
                time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                isUser: false
              }]);
            }, 1000);
          } else {
            console.error('Erro na resposta do webhook para áudio:', response.status);
          }
        } catch (error) {
          console.error('Erro ao enviar áudio:', error);
          // Adicionar mensagem de erro para áudio
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              text: "Erro ao processar áudio. Tente novamente.",
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              isUser: false
            }]);
          }, 500);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível acessar o microfone.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAgent) return;

    try {
      const webhookData = {
        agent_name: selectedAgent.name,
        agent_type: selectedAgent.type,
        action: 'test_agent',
        timestamp: new Date().toISOString(),
        source: 'portfolio_website',
        user_info: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone
        }
      };

      const response = await fetch('https://webhook.dev.solandox.com/webhook/portfolio_virtual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        toast({
          title: 'Agente Ativado!',
          description: `${selectedAgent.name} foi ativado com sucesso. Em breve você receberá mais informações.`,
        });
        setIsModalOpen(false);
        setFormData({ name: '', email: '', company: '', phone: '' });
      } else {
        throw new Error('Falha na requisição');
      }
    } catch (error) {
      console.error('Erro ao testar agente:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível ativar o agente. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

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

        {/* Logo */}
        <div className="relative mb-12">
          <Link to="/" className="flex items-center justify-center space-x-3 hover-scale">
            <span className="text-3xl font-bold gradient-text">Solandox</span>
          </Link>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
            <div className="absolute bottom-0 left-0 right-0 h-full">
              <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
            </div>
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
            type: 'sdr',
            icon: <Users className="h-8 w-8" />,
            description: 'Automatize prospecção e qualificação de leads. Este agente gerencia o funil de vendas, agenda reuniões e mantém interações personalizadas com potenciais clientes.'
          }, {
            name: 'Agente Clínicas',
            type: 'clinicas',
            icon: <Target className="h-8 w-8" />,
            description: 'Otimize o gerenciamento de pacientes e consultas. Este agente organiza agendamentos, envia lembretes e facilita a comunicação entre equipe médica e pacientes.'
          }, {
            name: 'Agente Imobiliárias',
            type: 'imobiliarias',
            icon: <Brain className="h-8 w-8" />,
            description: 'Transforme a experiência de compra e venda de imóveis. Este agente gerencia listagens, organiza visitas e qualifica leads para corretores, aumentando a eficiência do negócio.'
          }, {
            name: 'Agente Advocacia',
            type: 'advocacia',
            icon: <Shield className="h-8 w-8" />,
            description: 'Aumente a produtividade do escritório jurídico. Este agente organiza casos, pesquisa jurisprudência e facilita a comunicação com clientes e documentação.'
          }, {
            name: 'Agente Financeiro',
            type: 'financeiro',
            icon: <TrendingUp className="h-8 w-8" />,
            description: 'Optimize gestão financeira e análise de investimentos. Este agente automatiza relatórios, monitora fluxo de caixa e oferece insights para tomada de decisões estratégicas.'
          }, {
            name: 'Agente Vendedor Infoprodutos',
            type: 'infoprodutos',
            icon: <Zap className="h-8 w-8" />,
            description: 'Maximize vendas de produtos digitais e cursos online. Este agente qualifica leads, automatiza funis de venda e personaliza ofertas baseadas no comportamento do cliente.'
          }, {
            name: 'Agente CS',
            type: 'customer_service',
            icon: <Users className="h-8 w-8" />,
            description: 'Revolucione o atendimento ao cliente com respostas inteligentes 24/7. Este agente resolve dúvidas, escala problemas complexos e mantém histórico completo de interações.'
          }, {
            name: 'Agente Recuperador de Vendas',
            type: 'recuperador_vendas',
            icon: <Target className="h-8 w-8" />,
            description: 'Reconquiste clientes e recupere vendas perdidas. Este agente identifica oportunidades de reengajamento, cria campanhas personalizadas e automatiza follow-ups estratégicos.'
          }, {
            name: 'Agente Recrutamento Pessoal (RH)',
            type: 'rh',
            icon: <Brain className="h-8 w-8" />,
            description: 'Transforme processos de recrutamento e seleção. Este agente filtra currículos, agenda entrevistas, avalia candidatos e automatiza comunicação durante todo o processo seletivo.'
          }, {
            name: 'Agente para Escolas de Ensino',
            type: 'escolas',
            icon: <Shield className="h-8 w-8" />,
            description: 'Modernize a gestão educacional e comunicação escolar. Este agente gerencia matrículas, comunica com pais, acompanha desempenho de alunos e automatiza processos administrativos.'
          }, {
            name: 'Agente Terapeuta',
            type: 'terapeuta',
            icon: <Brain className="h-8 w-8" />,
            description: 'Apoie a prática terapêutica com agendamentos inteligentes. Este agente organiza sessões, envia lembretes, gerencia prontuários e facilita comunicação com pacientes.'
          }, {
            name: 'Agente para Psicólogos',
            type: 'psicologo',
            icon: <Brain className="h-8 w-8" />,
            description: 'Otimize a prática psicológica com gestão automatizada. Este agente agenda consultas, mantém registros seguros, envia lembretes e auxilia na organização de tratamentos.'
          }].map((agent, index) => (
              <div key={index} className="agent-card bg-gradient-to-br from-nexus-darker to-nexus-light border border-nexus-purple/20 rounded-lg p-6 hover:border-nexus-purple/40 flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-nexus-purple to-nexus-violet rounded-lg mx-auto mb-4 flex items-center justify-center text-white">
                  {agent.icon}
                </div>
                <h3 className="text-lg font-bold mb-4 text-white text-center">{agent.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">{agent.description}</p>
                <Button 
                  onClick={() => handleTestAgent(agent.name, agent.type)}
                  className="w-full bg-gradient-to-r from-nexus-purple to-nexus-violet text-white font-medium py-2 px-4 rounded-lg hover:from-nexus-violet hover:to-nexus-purple transition-all duration-300 mt-auto"
                >
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

      

      {/* Modal de Chat */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[400px] h-[600px] bg-nexus-darker border border-nexus-purple/20 p-0 flex flex-col">
          <DialogHeader className="p-4 border-b border-nexus-purple/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-nexus-purple to-nexus-violet rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-white text-lg">
                    {selectedAgent?.name}
                  </DialogTitle>
                  <p className="text-xs text-gray-400">Online agora</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-nexus-purple text-white'
                      : 'bg-nexus-light text-white'
                  }`}
                >
                  {message.audio ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Mic className="h-4 w-4" />
                      </div>
                      <audio controls className="max-w-[200px]">
                        <source src={message.audio} type="audio/wav" />
                      </audio>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">{message.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Área de input */}
          <div className="p-4 border-t border-nexus-purple/20">
            <div className="flex items-center space-x-2">
              <div className="flex-1 flex items-center bg-nexus-light rounded-full px-3 py-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>
              
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                className={`rounded-full w-10 h-10 p-0 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-nexus-purple hover:bg-nexus-violet'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="rounded-full w-10 h-10 p-0 bg-nexus-purple hover:bg-nexus-violet disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {isRecording && (
              <div className="mt-2 flex items-center justify-center text-red-400 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                Gravando áudio...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>;
};
export default Home;