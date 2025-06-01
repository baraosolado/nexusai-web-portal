
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { FormData, Agent } from '@/types';
import { leadService, agentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    agentOfInterest: ''
  });
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    loadAgents();
    
    // Check if there's an agent of interest passed from navigation state
    if (location.state?.agentOfInterest) {
      setFormData(prev => ({
        ...prev,
        agentOfInterest: location.state.agentOfInterest
      }));
    }
  }, [location.state]);

  const loadAgents = async () => {
    try {
      const response = await agentService.getActiveAgents(1, 100);
      setAgents(response.data);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, corrija os campos destacados.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await leadService.submitLead(formData);
      
      if (response.success) {
        toast({
          title: 'Mensagem enviada!',
          description: response.message || 'Entraremos em contato em breve.',
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: '',
          agentOfInterest: ''
        });
        setErrors({});
      } else {
        throw new Error(response.error || 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-nexus-dark to-nexus-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Entre em <span className="gradient-text">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 animate-fade-in">
              Pronto para transformar seu negócio com IA? Nossa equipe está aqui para ajudar.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold mb-8">Fale Conosco</h2>
              
              <div className="space-y-6">
                <Card className="nexus-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-gradient rounded-lg flex items-center justify-center mr-4">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Chat Online</h3>
                        <p className="text-gray-400 text-sm">Resposta imediata</p>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Use o formulário ao lado para nos enviar uma mensagem detalhada sobre suas necessidades.
                    </p>
                  </CardContent>
                </Card>

                <Card className="nexus-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-accent-gradient rounded-lg flex items-center justify-center mr-4">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Email</h3>
                        <p className="text-gray-400 text-sm">contato@nexusai.com</p>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Envie-nos um email e responderemos em até 24 horas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="nexus-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-gradient rounded-lg flex items-center justify-center mr-4">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Telefone</h3>
                        <p className="text-gray-400 text-sm">+55 (11) 9999-9999</p>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Ligue para nós em horário comercial para uma consulta rápida.
                    </p>
                  </CardContent>
                </Card>

                <Card className="nexus-card border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-accent-gradient rounded-lg flex items-center justify-center mr-4">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Horário de Atendimento</h3>
                        <p className="text-gray-400 text-sm">Seg - Sex: 9h às 18h</p>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Estamos disponíveis em horário comercial para atendê-lo.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="nexus-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Envie sua Mensagem</CardTitle>
                  <CardDescription className="text-gray-400">
                    Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-white">Nome *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`nexus-input ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-white">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`nexus-input ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-white">Telefone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="nexus-input"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="company" className="text-white">Empresa</Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Nome da sua empresa"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="nexus-input"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="agent" className="text-white">Agente de Interesse</Label>
                      <Select 
                        value={formData.agentOfInterest} 
                        onValueChange={(value) => handleInputChange('agentOfInterest', value)}
                      >
                        <SelectTrigger className="nexus-input">
                          <SelectValue placeholder="Selecione um agente (opcional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-nexus-light border-white/20">
                          <SelectItem value="" className="text-white hover:bg-nexus-purple/20">
                            Nenhum agente específico
                          </SelectItem>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id} className="text-white hover:bg-nexus-purple/20">
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white">Mensagem *</Label>
                      <Textarea
                        id="message"
                        placeholder="Conte-nos sobre seu projeto ou necessidades..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`nexus-input resize-none ${errors.message ? 'border-red-500' : ''}`}
                      />
                      {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full nexus-button text-lg py-4 group"
                    >
                      {loading ? (
                        <div className="loading-spinner mr-2"></div>
                      ) : (
                        <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      )}
                      {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-nexus-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-400">Respostas para as dúvidas mais comuns sobre nossos serviços.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="nexus-card">
              <h3 className="text-lg font-semibold text-white mb-3">
                Quanto tempo leva para implementar um agente?
              </h3>
              <p className="text-gray-400">
                O tempo de implementação varia de 2 a 8 semanas, dependendo da complexidade 
                do projeto e das integrações necessárias.
              </p>
            </div>
            
            <div className="nexus-card">
              <h3 className="text-lg font-semibold text-white mb-3">
                Vocês oferecem suporte após a implementação?
              </h3>
              <p className="text-gray-400">
                Sim, oferecemos suporte completo 24/7, treinamento da equipe e 
                atualizações contínuas do sistema.
              </p>
            </div>
            
            <div className="nexus-card">
              <h3 className="text-lg font-semibold text-white mb-3">
                É possível personalizar os agentes?
              </h3>
              <p className="text-gray-400">
                Absolutamente! Todos os nossos agentes são personalizáveis para 
                atender às necessidades específicas do seu negócio.
              </p>
            </div>
            
            <div className="nexus-card">
              <h3 className="text-lg font-semibold text-white mb-3">
                Qual é o investimento necessário?
              </h3>
              <p className="text-gray-400">
                O investimento varia conforme a solução escolhida. Entre em contato 
                para receber uma proposta personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
