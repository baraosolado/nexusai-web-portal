import React, { useState, useRef, useEffect } from 'react';
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
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para gerar números aleatórios simples para session_id
  const generateSessionId = () => {
    return Math.floor(Math.random() * 1000000000).toString();
  };

  const [userId, setUserId] = useState<string>('');

  // Scroll automático para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const agentIdentifiers: { [key: string]: string } = {
    sdr: 'agente-comercial-sdr',
    clinicas: 'agente-clinicas',
    imobiliarias: 'agente-imobiliarias',
    advocacia: 'agente-advocacia',
    financeiro: 'agente-financeiro',
    infoprodutos: 'agente-vendedor-infoprodutos',
    customer_service: 'agente-cs',
    recuperador_vendas: 'agente-recuperador-de-vendas',
    rh: 'agente-recrutamento-pessoal-rh',
    escolas: 'agente-para-escolas-de-ensino',
    terapeuta: 'agente-terapeuta',
    psicologo: 'agente-para-psicologos'
  };

  // Função para extrair mensagem da resposta do webhook
  const extractMessage = (response: any): string => {
    console.log('Extraindo mensagem da resposta completa:', JSON.stringify(response, null, 2));

    // Se for string diretamente, retornar
    if (typeof response === 'string' && response.trim()) {
      console.log('Resposta é string válida:', response);
      return response.trim();
    }

    // Se for array, verificar se o primeiro item tem a propriedade 'output'
    if (Array.isArray(response) && response.length > 0) {
      console.log('Resposta é array, analisando primeiro item:', response[0]);
      const firstItem = response[0];

      // Verificar se o primeiro item tem a propriedade 'output'
      if (firstItem && typeof firstItem === 'object' && firstItem.output) {
        console.log('Encontrado output no array:', firstItem.output);
        if (typeof firstItem.output === 'string' && firstItem.output.trim()) {
          return firstItem.output.trim();
        }
      }

      // Se não encontrou output, tentar extrair recursivamente do primeiro item
      return extractMessage(firstItem);
    }

    // Se for objeto, tentar encontrar a mensagem
    if (response && typeof response === 'object') {
      // Verificar primeiro se tem a propriedade 'output' (formato específico do seu backend)
      if (response.output && typeof response.output === 'string' && response.output.trim()) {
        console.log('Mensagem encontrada na propriedade output:', response.output);
        return response.output.trim();
      }

      // Lista expandida de possíveis chaves que podem conter a mensagem
      const possibleKeys = [
        'message', 'response', 'text', 'content', 'agent_response',
        'answer', 'reply', 'result', 'data', 'body', 'payload',
        'response_text', 'bot_response', 'agent_message', 'ai_response',
        'success', 'msg', 'responseText', 'value'
      ];

      // Tentar encontrar a mensagem nas chaves conhecidas
      for (const key of possibleKeys) {
        if (response[key] !== undefined && response[key] !== null) {
          console.log(`Verificando chave '${key}':`, response[key]);

          if (typeof response[key] === 'string' && response[key].trim().length > 0) {
            console.log(`Mensagem encontrada na chave '${key}':`, response[key]);
            return response[key].trim();
          }

          // Se for objeto ou array, tentar extrair recursivamente
          if (typeof response[key] === 'object') {
            const nestedResult = extractMessage(response[key]);
            if (nestedResult && nestedResult !== "Desculpe, não consegui processar sua mensagem. Tente novamente.") {
              return nestedResult;
            }
          }
        }
      }

      // Buscar qualquer string não vazia no objeto (com menos restrições)
      for (const [key, value] of Object.entries(response)) {
        if (typeof value === 'string' && value.trim().length > 2) {
          console.log(`Usando string encontrada na chave '${key}':`, value);
          return value.trim();
        }
      }

      // Como último recurso, retornar uma mensagem mais genérica
      console.log('Usando resposta genérica - resposta recebida mas não processável');
      return "Recebi sua mensagem e estou processando. Em breve nossa equipe entrará em contato!";
    }

    console.log('Nenhuma mensagem válida encontrada');
    return "Obrigado pela sua mensagem! Nossa equipe analisará e responderá em breve.";
  };

  const handleTestAgent = (agentName: string, agentType: string) => {
    setSelectedAgent({ name: agentName, type: agentType });

    // Gerar novo userId apenas se não existir um para esta sessão
    if (!userId) {
      const newUserId = generateSessionId();
      setUserId(newUserId);
      console.log('Novo userId gerado para sessão de chat:', newUserId);
    } else {
      console.log('Usando userId existente da sessão:', userId);
    }

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
    setIsWaitingForResponse(true);

    // Chamar webhook com a mensagem do usuário
    try {
      const agentId = agentIdentifiers[selectedAgent.type] || selectedAgent.type;

      const webhookData = {
        agent_name: selectedAgent.name,
        agent_type: selectedAgent.type,
        agent_id: agentId,
        user_id: userId,
        action: 'chat_message',
        message: messageToSend,
        timestamp: new Date().toISOString(),
        source: 'portfolio_website'
      };

      console.log('Enviando dados para webhook:', webhookData);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Timeout: Requisição cancelada após 30 segundos');
      }, 30000);

      const response = await fetch('https://webhook.dev.solandox.com/webhook/portfolio_virtual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('Status da resposta:', response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Resposta bruta do webhook:', responseText);

        let webhookResponse;
        let agentMessage = '';

        try {
          if (responseText.trim()) {
            // Tentar fazer parse como JSON
            try {
              webhookResponse = JSON.parse(responseText);
              console.log('Resposta parseada do webhook:', webhookResponse);
              agentMessage = extractMessage(webhookResponse);
            } catch (parseError) {
              console.log('Não foi possível fazer parse do JSON, usando texto diretamente:', responseText);
              // Se não conseguir fazer parse, usar o texto diretamente
              agentMessage = responseText.trim();
            }
          } else {
            console.log('Resposta vazia do servidor');
            agentMessage = "Sua mensagem foi recebida! Nossa equipe analisará e responderá em breve.";
          }
        } catch (error) {
          console.error('Erro ao processar resposta:', error);
          agentMessage = "Mensagem recebida com sucesso! Em breve nossa equipe entrará em contato.";
        }

        console.log('Mensagem final extraída do agente:', agentMessage);

        // Sempre adicionar uma resposta, mesmo que seja genérica
        setTimeout(() => {
          setMessages(prev => {
            const newBotMessage = {
              id: Date.now() + 1,
              text: agentMessage || "Obrigado pela mensagem! Nossa equipe responderá em breve.",
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              isUser: false
            };
            console.log('Nova mensagem do bot criada e adicionada:', newBotMessage);
            return [...prev, newBotMessage];
          });
          setIsWaitingForResponse(false);
        }, 1000); // Aumentando delay para 1 segundo

      } else {
        const errorText = await response.text();
        console.error('Erro na resposta do webhook:', response.status, response.statusText, errorText);

        // Mesmo com erro HTTP, adicionar uma mensagem de resposta
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "Sua mensagem foi recebida! Devido a um problema temporário, nossa equipe verificará manualmente e responderá em breve.",
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isUser: false
          }]);
          setIsWaitingForResponse(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Sua mensagem foi registrada! Devido a um problema de conexão temporário, nossa equipe verificará manualmente e responderá em breve.",
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isUser: false
        }]);
        setIsWaitingForResponse(false);
      }, 1000);

      // Removendo o toast de erro para evitar confundir o usuário
      console.log('Mensagem do usuário foi registrada, mesmo com erro de rede');
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
        setIsWaitingForResponse(true);

        try {
          const agentId = agentIdentifiers[selectedAgent?.type || ''] || selectedAgent?.type;

          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const base64Audio = reader.result as string;
              const base64Data = base64Audio.split(',')[1];

              console.log('Enviando áudio em base64 para webhook');

              // Garantir que existe um userId para esta sessão
              let currentUserId = userId;
              if (!currentUserId) {
                currentUserId = generateSessionId();
                setUserId(currentUserId);
                console.log('UserId gerado durante envio de áudio:', currentUserId);
              }

              const webhookData = {
                agent_name: selectedAgent?.name,
                agent_type: selectedAgent?.type,
                agent_id: agentId,
                user_id: currentUserId,
                action: 'chat_audio',
                audio_data: base64Data,
                timestamp: new Date().toISOString(),
                source: 'portfolio_website'
              };

              console.log('Enviando áudio com userId:', currentUserId);

              const controller = new AbortController();
              const timeoutId = setTimeout(() => {
                controller.abort();
                console.log('Timeout: Requisição cancelada após 30 segundos');
              }, 30000);

              const response = await fetch('https://webhook.dev.solandox.com/webhook/portfolio_virtual', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookData),
                signal: controller.signal
              });

              clearTimeout(timeoutId);

              console.log('Status da resposta do webhook para áudio:', response.status);

              if (response.ok) {
                const responseText = await response.text();
                console.log('Resposta bruta do webhook para áudio:', responseText);

                let webhookResponse;
                try {
                  webhookResponse = JSON.parse(responseText);
                } catch (parseError) {
                  console.error('Erro ao fazer parse do JSON para áudio:', parseError);
                  throw new Error('Resposta inválida do servidor para áudio');
                }

                console.log('Resposta parseada do webhook para áudio:', webhookResponse);

                const agentMessage = extractMessage(webhookResponse);
                console.log('Mensagem de áudio extraída do agente:', agentMessage);

                if (agentMessage && agentMessage.trim()) {
                  console.log('Adicionando resposta válida de áudio do bot:', agentMessage);

                  setTimeout(() => {
                    setMessages(prev => {
                      const newBotMessage = {
                        id: Date.now() + 1,
                        text: agentMessage,
                        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                        isUser: false
                      };
                      console.log('Nova mensagem de áudio do bot criada e adicionada:', newBotMessage);
                      const updatedMessages = [...prev, newBotMessage];
                      console.log('Estado completo das mensagens de áudio após adição:', updatedMessages);
                      return updatedMessages;
                    });
                    setIsWaitingForResponse(false);
                  }, 500);
                } else {
                  console.error('Mensagem de áudio do agente está vazia ou inválida:', agentMessage);
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      id: Date.now() + 1,
                      text: "Recebi seu áudio, mas houve um problema na resposta. Nossa equipe verificará em breve.",
                      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                      isUser: false
                    }]);
                    setIsWaitingForResponse(false);
                  }, 500);
                }
              } else {
                const errorText = await response.text();
                console.error('Erro na resposta do webhook para áudio:', response.status, response.statusText, errorText);
                throw new Error(`Falha na requisição de áudio: ${response.status}`);
              }
            } catch (error) {
              console.error('Erro ao processar áudio:', error);
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  text: "Erro ao processar áudio. Tente novamente.",
                  time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                  isUser: false
                }]);
                setIsWaitingForResponse(false);
              }, 45000);

              toast({
                title: 'Erro',
                description: 'Não foi possível enviar o áudio. Tente novamente.',
                variant: 'destructive',
              });
            }
          };
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Erro ao enviar áudio:', error);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              text: "Erro ao processar áudio. Tente novamente.",
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              isUser: false
            }]);
            setIsWaitingForResponse(false);
          }, 300);
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
      const agentId = agentIdentifiers[selectedAgent.type] || selectedAgent.type;

      const webhookData = {
        agent_name: selectedAgent.name,
        agent_type: selectedAgent.type,
        agent_id: agentId,
        user_id: userId,
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Timeout: Requisição cancelada após 30 segundos');
      }, 30000);

      const response = await fetch('https://webhook.dev.solandox.com/webhook/portfolio_virtual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-nexus-dark via-nexus-darker to-nexus-light opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-nexus-purple/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-nexus-violet/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>

        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

        {/* Logo */}
        <div className="relative mb-6">
          <Link to="/" className="flex items-center justify-center space-x-3 hover-scale">
            <span className="text-3xl font-bold gradient-text">Solandox</span>
          </Link>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1">
          {/* Left content */}
          <div className="text-center lg:text-left lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              Transforme seu Negócio com{' '}
              <span className="gradient-text">Agentes de IA</span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in leading-relaxed">
              Descubra como nossos agentes de IA especializados podem revolucionar 
              sua empresa, otimizar processos e maximizar resultados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/agentes">
                <Button className="nexus-button text-lg px-8 py-4 group">
                  Conhecer Soluções
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right content - 3D Robot */}
          <div className="relative h-[500px] lg:h-[600px] flex items-end justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] h-[450px] lg:h-[550px]">
              <div className="absolute inset-0 bottom-0">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" 
                  className="w-full h-full object-contain" 
                />
              </div>
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
                  className="agent-button w-full bg-gradient-to-r from-nexus-purple to-nexus-violet text-white font-medium py-2 px-4 rounded-lg hover:from-nexus-violet hover:to-nexus-purple transition-all duration-150 mt-auto"
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
            {benefits.map((benefit, index) => (
              <div key={index} className="nexus-card hover-scale animate-fade-in group">
                <div className="w-12 h-12 bg-purple-gradient rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
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
      <Dialog open={isChatOpen} onOpenChange={(open) => {
        setIsChatOpen(open);
        // Resetar userId quando modal for fechado
        if (!open) {
          setUserId('');
        }
      }}>
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
            <div ref={messagesEndRef} />
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
    </Layout>
  );
};

export default Home;