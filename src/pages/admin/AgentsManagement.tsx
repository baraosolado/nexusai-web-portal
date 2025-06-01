
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Brain, Search, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Agent, AgentFormData } from '@/types';
import { agentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AgentsManagement: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    shortDescription: '',
    longDescription: '',
    features: [],
    benefits: [],
    sectors: [],
    imageUrl: '',
    status: 'active'
  });
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  const availableSectors = ['Saúde', 'Imobiliário', 'Jurídico', 'Financeiro', 'Consultoria', 'Educação', 'Varejo', 'Tecnologia'];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAllAgents(1, 100);
      setAgents(response.data);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agentes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateDialog = () => {
    setEditingAgent(null);
    setFormData({
      name: '',
      shortDescription: '',
      longDescription: '',
      features: [],
      benefits: [],
      sectors: [],
      imageUrl: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      shortDescription: agent.shortDescription,
      longDescription: agent.longDescription,
      features: agent.features,
      benefits: agent.benefits,
      sectors: agent.sectors,
      imageUrl: agent.imageUrl,
      status: agent.status
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingAgent) {
        const response = await agentService.updateAgent(editingAgent.id, formData);
        if (response.success) {
          toast({
            title: 'Sucesso!',
            description: response.message,
          });
          loadAgents();
          setIsDialogOpen(false);
        }
      } else {
        const response = await agentService.createAgent(formData);
        if (response.success) {
          toast({
            title: 'Sucesso!',
            description: response.message,
          });
          loadAgents();
          setIsDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o agente.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!agentToDelete) return;

    try {
      const response = await agentService.deleteAgent(agentToDelete.id);
      if (response.success) {
        toast({
          title: 'Sucesso!',
          description: response.message,
        });
        loadAgents();
        setDeleteDialogOpen(false);
        setAgentToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o agente.',
        variant: 'destructive',
      });
    }
  };

  const addListItem = (field: 'features' | 'benefits' | 'sectors', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeListItem = (field: 'features' | 'benefits' | 'sectors', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciar Agentes</h1>
            <p className="text-gray-400">Adicione, edite e gerencie os agentes de IA</p>
          </div>
          <Button onClick={openCreateDialog} className="nexus-button">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agente
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="nexus-card border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar agentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 nexus-input"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 nexus-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-nexus-light border-white/20">
                    <SelectItem value="all" className="text-white hover:bg-nexus-purple/20">
                      Todos os Status
                    </SelectItem>
                    <SelectItem value="active" className="text-white hover:bg-nexus-purple/20">
                      Ativos
                    </SelectItem>
                    <SelectItem value="inactive" className="text-white hover:bg-nexus-purple/20">
                      Inativos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="nexus-card border-0 animate-pulse">
                <CardContent className="p-6">
                  <div className="w-full h-32 bg-nexus-light/30 rounded-lg mb-4"></div>
                  <div className="h-6 bg-nexus-light/30 rounded mb-2"></div>
                  <div className="h-4 bg-nexus-light/30 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-nexus-light/30 rounded w-20"></div>
                    <div className="h-8 bg-nexus-light/30 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <Card className="nexus-card border-0">
            <CardContent className="p-12 text-center">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Nenhum agente encontrado
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar seus filtros ou termo de busca.'
                  : 'Comece criando seu primeiro agente de IA.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={openCreateDialog} className="nexus-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Agente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="nexus-card border-0 hover-scale group">
                <CardContent className="p-6">
                  <div className="w-full h-32 bg-accent-gradient rounded-lg mb-4 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{agent.name}</h3>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className={agent.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'}
                    >
                      {agent.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {agent.shortDescription}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {agent.sectors.slice(0, 2).map((sector, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-nexus-purple/30 text-nexus-purple">
                        {sector}
                      </Badge>
                    ))}
                    {agent.sectors.length > 2 && (
                      <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-400">
                        +{agent.sectors.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(agent)}
                      className="flex-1 border-nexus-purple/30 text-nexus-purple hover:bg-nexus-purple hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAgentToDelete(agent);
                        setDeleteDialogOpen(true);
                      }}
                      className="border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-nexus-light border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingAgent ? 'Editar Agente' : 'Novo Agente'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingAgent ? 'Atualize as informações do agente.' : 'Preencha os dados do novo agente de IA.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="nexus-input"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-white">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'active' | 'inactive') => 
                      setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="nexus-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-nexus-light border-white/20">
                      <SelectItem value="active" className="text-white hover:bg-nexus-purple/20">
                        Ativo
                      </SelectItem>
                      <SelectItem value="inactive" className="text-white hover:bg-nexus-purple/20">
                        Inativo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <Label htmlFor="shortDescription" className="text-white">Descrição Curta *</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="nexus-input resize-none"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="longDescription" className="text-white">Descrição Longa *</Label>
                <Textarea
                  id="longDescription"
                  value={formData.longDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                  className="nexus-input resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="imageUrl" className="text-white">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="nexus-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Dynamic Lists */}
              {['features', 'benefits', 'sectors'].map((field) => (
                <div key={field}>
                  <Label className="text-white capitalize">{field === 'features' ? 'Funcionalidades' : field === 'benefits' ? 'Benefícios' : 'Setores'}</Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 bg-nexus-dark/50 rounded border border-white/20">
                      {formData[field as keyof typeof formData].map((item: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-nexus-purple/20 text-nexus-purple">
                          {item}
                          <button
                            type="button"
                            onClick={() => removeListItem(field as 'features' | 'benefits' | 'sectors', index)}
                            className="ml-1 hover:text-red-400"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {field === 'sectors' ? (
                        <Select onValueChange={(value) => addListItem(field as 'sectors', value)}>
                          <SelectTrigger className="nexus-input">
                            <SelectValue placeholder={`Adicionar ${field === 'features' ? 'funcionalidade' : field === 'benefits' ? 'benefício' : 'setor'}`} />
                          </SelectTrigger>
                          <SelectContent className="bg-nexus-light border-white/20">
                            {availableSectors.filter(sector => !formData.sectors.includes(sector)).map((sector) => (
                              <SelectItem key={sector} value={sector} className="text-white hover:bg-nexus-purple/20">
                                {sector}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder={`Adicionar ${field === 'features' ? 'funcionalidade' : 'benefício'}`}
                          className="nexus-input"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              addListItem(field as 'features' | 'benefits', input.value);
                              input.value = '';
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="nexus-button"
                >
                  {formLoading ? (
                    <div className="loading-spinner mr-2"></div>
                  ) : null}
                  {formLoading ? 'Salvando...' : editingAgent ? 'Atualizar' : 'Criar Agente'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-nexus-light border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
              <DialogDescription className="text-gray-400">
                Tem certeza que deseja excluir o agente "{agentToDelete?.name}"? 
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AgentsManagement;
