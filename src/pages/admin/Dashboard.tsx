
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, MessageSquare, TrendingUp, Plus, Settings, BarChart3 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { agentService, leadService } from '@/services/api';
import { Agent, Lead } from '@/types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalLeads: 0,
    newLeads: 0
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentAgents, setRecentAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load agents data
      const agentsResponse = await agentService.getAllAgents(1, 100);
      const activeAgents = agentsResponse.data.filter(agent => agent.status === 'active');
      
      // Load leads data
      const leadsResponse = await leadService.getLeads(1, 10);
      const newLeads = leadsResponse.data.filter(lead => lead.status === 'new');
      
      setStats({
        totalAgents: agentsResponse.data.length,
        activeAgents: activeAgents.length,
        totalLeads: leadsResponse.total,
        newLeads: newLeads.length
      });
      
      setRecentLeads(leadsResponse.data.slice(0, 5));
      setRecentAgents(agentsResponse.data.slice(0, 4));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Agentes',
      value: stats.totalAgents,
      description: `${stats.activeAgents} ativos`,
      icon: Brain,
      color: 'bg-purple-gradient'
    },
    {
      title: 'Agentes Ativos',
      value: stats.activeAgents,
      description: 'Disponíveis para uso',
      icon: TrendingUp,
      color: 'bg-accent-gradient'
    },
    {
      title: 'Total de Leads',
      value: stats.totalLeads,
      description: `${stats.newLeads} novos`,
      icon: Users,
      color: 'bg-purple-gradient'
    },
    {
      title: 'Leads Novos',
      value: stats.newLeads,
      description: 'Aguardando contato',
      icon: MessageSquare,
      color: 'bg-accent-gradient'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Agente',
      description: 'Adicionar um novo agente de IA',
      icon: Plus,
      href: '/admin/agentes?action=create',
      color: 'bg-purple-gradient'
    },
    {
      title: 'Gerenciar Agentes',
      description: 'Visualizar e editar agentes',
      icon: Brain,
      href: '/admin/agentes',
      color: 'bg-accent-gradient'
    },
    {
      title: 'Ver Leads',
      description: 'Gerenciar leads e contatos',
      icon: Users,
      href: '/admin/leads',
      color: 'bg-purple-gradient'
    },
    {
      title: 'Relatórios',
      description: 'Análises e métricas',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-accent-gradient'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral do sistema NexusAI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="nexus-card border-0 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {loading ? '-' : stat.value}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="nexus-card border-0">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-400">
                Acesso rápido às principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <div className="nexus-card hover-scale cursor-pointer group">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white group-hover:text-nexus-purple transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card className="nexus-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Leads Recentes</CardTitle>
                  <CardDescription className="text-gray-400">
                    Últimos contatos recebidos
                  </CardDescription>
                </div>
                <Link to="/admin/leads">
                  <Button variant="ghost" size="sm" className="text-nexus-purple hover:bg-nexus-purple/20">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-nexus-light/30 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-nexus-light/30 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-nexus-light/30 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentLeads.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Nenhum lead encontrado</p>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-nexus-light/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-nexus-purple/20 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-nexus-purple" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{lead.name}</p>
                          <p className="text-gray-400 text-sm">{lead.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          lead.status === 'new' ? 'bg-green-500/20 text-green-400' :
                          lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {lead.status === 'new' ? 'Novo' : 
                           lead.status === 'contacted' ? 'Contatado' : 'Fechado'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Agents */}
        <Card className="nexus-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Agentes Recentes</CardTitle>
                <CardDescription className="text-gray-400">
                  Últimos agentes adicionados ao sistema
                </CardDescription>
              </div>
              <Link to="/admin/agentes">
                <Button variant="ghost" size="sm" className="text-nexus-purple hover:bg-nexus-purple/20">
                  Ver todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="nexus-card animate-pulse">
                    <div className="w-full h-32 bg-nexus-light/30 rounded-lg mb-3"></div>
                    <div className="h-4 bg-nexus-light/30 rounded mb-2"></div>
                    <div className="h-3 bg-nexus-light/30 rounded w-3/4"></div>
                  </div>
                ))
              ) : recentAgents.length === 0 ? (
                <div className="col-span-4 text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum agente encontrado</p>
                </div>
              ) : (
                recentAgents.map((agent) => (
                  <div key={agent.id} className="nexus-card hover-scale">
                    <div className="w-full h-32 bg-accent-gradient rounded-lg mb-3 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-medium text-white mb-1 truncate">{agent.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{agent.shortDescription}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {agent.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
