
import { Agent, Lead, FormData, AgentFormData, ApiResponse, PaginatedResponse } from '@/types';

// Mock data - replace with actual API calls
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Dr. Clinic AI',
    slug: 'dr-clinic-ai',
    shortDescription: 'Agente especializado em gestão de clínicas médicas e atendimento ao paciente',
    longDescription: 'O Dr. Clinic AI é um sistema avançado de inteligência artificial projetado especificamente para otimizar a gestão de clínicas médicas. Com capacidades de agendamento inteligente, análise de prontuários e suporte ao diagnóstico, este agente revoluciona a forma como as clínicas operam.',
    features: [
      'Agendamento inteligente de consultas',
      'Análise automatizada de prontuários',
      'Suporte ao diagnóstico médico',
      'Gestão de inventário de medicamentos',
      'Relatórios de performance da clínica',
      'Interface amigável para pacientes'
    ],
    benefits: [
      'Redução de 40% no tempo de agendamento',
      'Melhoria na precisão diagnóstica',
      'Otimização do fluxo de pacientes',
      'Redução de custos operacionais',
      'Maior satisfação dos pacientes'
    ],
    sectors: ['Saúde', 'Medicina', 'Clínicas'],
    imageUrl: '/api/placeholder/300/200',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Realty AI Pro',
    slug: 'realty-ai-pro',
    shortDescription: 'Solução de IA para otimização de vendas e gestão imobiliária',
    longDescription: 'O Realty AI Pro é uma plataforma inteligente que revolutiona o mercado imobiliário através da análise preditiva de preços, matching automático entre clientes e propriedades, e otimização de processos de venda.',
    features: [
      'Análise preditiva de preços de imóveis',
      'Matching inteligente cliente-propriedade',
      'Automação de processos de venda',
      'Gestão de leads qualificados',
      'Análise de mercado em tempo real',
      'Relatórios personalizados'
    ],
    benefits: [
      'Aumento de 60% na taxa de conversão',
      'Redução do tempo de venda',
      'Melhor qualificação de leads',
      'Precisão na avaliação de imóveis',
      'Otimização da carteira de clientes'
    ],
    sectors: ['Imobiliário', 'Vendas', 'Investimentos'],
    imageUrl: '/api/placeholder/300/200',
    status: 'active',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'Legal AI Assistant',
    slug: 'legal-ai-assistant',
    shortDescription: 'Assistente jurídico inteligente para escritórios de advocacia',
    longDescription: 'O Legal AI Assistant é uma ferramenta avançada de inteligência artificial que auxilia advogados na pesquisa jurisprudencial, análise de contratos, elaboração de petições e gestão de processos.',
    features: [
      'Pesquisa jurisprudencial automatizada',
      'Análise inteligente de contratos',
      'Elaboração assistida de petições',
      'Gestão de prazos processuais',
      'Análise de riscos jurídicos',
      'Biblioteca jurídica inteligente'
    ],
    benefits: [
      'Redução de 70% no tempo de pesquisa',
      'Maior precisão nas análises',
      'Otimização de prazos processuais',
      'Redução de erros em petições',
      'Aumento da produtividade do escritório'
    ],
    sectors: ['Jurídico', 'Advocacia', 'Consultoria Legal'],
    imageUrl: '/api/placeholder/300/200',
    status: 'active',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  },
  {
    id: '4',
    name: 'FinanceBot AI',
    slug: 'financebot-ai',
    shortDescription: 'Agente de IA para análise financeira e consultoria de investimentos',
    longDescription: 'O FinanceBot AI é uma solução completa para análise financeira, oferecendo insights inteligentes sobre investimentos, análise de riscos, planejamento financeiro e otimização de portfólios.',
    features: [
      'Análise preditiva de mercados',
      'Otimização de portfólios',
      'Análise de riscos em tempo real',
      'Planejamento financeiro personalizado',
      'Alertas de oportunidades',
      'Relatórios executivos automatizados'
    ],
    benefits: [
      'Melhoria de 45% no ROI',
      'Redução significativa de riscos',
      'Decisões baseadas em dados',
      'Automatização de análises',
      'Estratégias personalizadas'
    ],
    sectors: ['Financeiro', 'Investimentos', 'Consultoria'],
    imageUrl: '/api/placeholder/300/200',
    status: 'active',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z'
  }
];

const mockLeads: Lead[] = [];

export const agentService = {
  // Public API
  async getActiveAgents(page = 1, limit = 10, sector?: string): Promise<PaginatedResponse<Agent>> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredAgents = mockAgents.filter(agent => agent.status === 'active');
    
    if (sector) {
      filteredAgents = filteredAgents.filter(agent => 
        agent.sectors.some(s => s.toLowerCase().includes(sector.toLowerCase()))
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAgents = filteredAgents.slice(startIndex, endIndex);
    
    return {
      data: paginatedAgents,
      total: filteredAgents.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAgents.length / limit)
    };
  },

  async getAgentBySlug(slug: string): Promise<Agent | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAgents.find(agent => agent.slug === slug && agent.status === 'active') || null;
  },

  // Admin API
  async getAllAgents(page = 1, limit = 10): Promise<PaginatedResponse<Agent>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAgents = mockAgents.slice(startIndex, endIndex);
    
    return {
      data: paginatedAgents,
      total: mockAgents.length,
      page,
      limit,
      totalPages: Math.ceil(mockAgents.length / limit)
    };
  },

  async createAgent(agentData: AgentFormData): Promise<ApiResponse<Agent>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAgent: Agent = {
      id: (mockAgents.length + 1).toString(),
      ...agentData,
      slug: agentData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockAgents.push(newAgent);
    
    return {
      success: true,
      data: newAgent,
      message: 'Agente criado com sucesso!'
    };
  },

  async updateAgent(id: string, agentData: Partial<AgentFormData>): Promise<ApiResponse<Agent>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) {
      return {
        success: false,
        error: 'Agente não encontrado'
      };
    }
    
    const updatedAgent = {
      ...mockAgents[agentIndex],
      ...agentData,
      updatedAt: new Date().toISOString()
    };
    
    if (agentData.name) {
      updatedAgent.slug = agentData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    
    mockAgents[agentIndex] = updatedAgent;
    
    return {
      success: true,
      data: updatedAgent,
      message: 'Agente atualizado com sucesso!'
    };
  },

  async deleteAgent(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) {
      return {
        success: false,
        error: 'Agente não encontrado'
      };
    }
    
    mockAgents.splice(agentIndex, 1);
    
    return {
      success: true,
      message: 'Agente excluído com sucesso!'
    };
  }
};

export const leadService = {
  async submitLead(formData: FormData): Promise<ApiResponse<Lead>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newLead: Lead = {
      id: (mockLeads.length + 1).toString(),
      ...formData,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    mockLeads.push(newLead);
    
    return {
      success: true,
      data: newLead,
      message: 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.'
    };
  },

  async getLeads(page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Lead>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLeads = status ? mockLeads.filter(lead => lead.status === status) : mockLeads;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
    
    return {
      data: paginatedLeads,
      total: filteredLeads.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLeads.length / limit)
    };
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<ApiResponse<Lead>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const leadIndex = mockLeads.findIndex(lead => lead.id === id);
    if (leadIndex === -1) {
      return {
        success: false,
        error: 'Lead não encontrado'
      };
    }
    
    mockLeads[leadIndex].status = status;
    
    return {
      success: true,
      data: mockLeads[leadIndex],
      message: 'Status do lead atualizado com sucesso!'
    };
  }
};
