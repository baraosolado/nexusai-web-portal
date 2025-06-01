
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Agent, AgentFormData } from '@/types';
import { agentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AgentsManagement: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
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
  const { toast } = useToast();

  // Form state for array inputs
  const [featuresInput, setFeaturesInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [sectorsInput, setSectorsInput] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAllAgents();
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

  const handleOpenDialog = (agent?: Agent) => {
    if (agent) {
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
      // Set input fields for arrays
      setFeaturesInput(agent.features.join(', '));
      setBenefitsInput(agent.benefits.join(', '));
      setSectorsInput(agent.sectors.join(', '));
    } else {
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
      setFeaturesInput('');
      setBenefitsInput('');
      setSectorsInput('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAgent(null);
  };

  const handleInputChange = (field: keyof AgentFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const parseArrayInput = (input: string): string[] => {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse array inputs
      const processedFormData = {
        ...formData,
        features: parseArrayInput(featuresInput),
        benefits: parseArrayInput(benefitsInput),
        sectors: parseArrayInput(sectorsInput)
      };

      if (editingAgent) {
        await agentService.updateAgent(editingAgent.id, processedFormData);
        toast({
          title: 'Sucesso',
          description: 'Agente atualizado com sucesso!',
        });
      } else {
        await agentService.createAgent(processedFormData);
        toast({
          title: 'Sucesso',
          description: 'Agente criado com sucesso!',
        });
      }

      handleCloseDialog();
      loadAgents();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Erro',
        description: `Não foi possível ${editingAgent ? 'atualizar' : 'criar'} o agente.`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agente?')) {
      return;
    }

    try {
      await agentService.deleteAgent(id);
      toast({
        title: 'Sucesso',
        description: 'Agente excluído com sucesso!',
      });
      loadAgents();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o agente.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (agent: Agent) => {
    try {
      const updatedData = {
        ...agent,
        status: agent.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive'
      };
      
      await agentService.updateAgent(agent.id, updatedData);
      toast({
        title: 'Sucesso',
        description: `Agente ${updatedData.status === 'active' ? 'ativado' : 'desativado'} com sucesso!`,
      });
      loadAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do agente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Gerenciamento de Agentes</h1>
            <p className="text-gray-400">Gerencie os agentes de IA da plataforma</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="nexus-button"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agente
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-nexus-light border-white/20">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingAgent ? 'Editar Agente' : 'Novo Agente'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nome *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="nexus-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch
                        id="status"
                        checked={formData.status === 'active'}
                        onCheckedChange={(checked) => 
                          handleInputChange('status', checked ? 'active' : 'inactive')
                        }
                      />
                      <Label htmlFor="status" className="text-white">
                        {formData.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription" className="text-white">Descrição Curta *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    className="nexus-input"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="longDescription" className="text-white">Descrição Longa *</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => handleInputChange('longDescription', e.target.value)}
                    className="nexus-input"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features" className="text-white">Funcionalidades</Label>
                  <Textarea
                    id="features"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Separe as funcionalidades por vírgula"
                    className="nexus-input"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="benefits" className="text-white">Benefícios</Label>
                  <Textarea
                    id="benefits"
                    value={benefitsInput}
                    onChange={(e) => setBenefitsInput(e.target.value)}
                    placeholder="Separe os benefícios por vírgula"
                    className="nexus-input"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="sectors" className="text-white">Setores</Label>
                  <Input
                    id="sectors"
                    type="text"
                    value={sectorsInput}
                    onChange={(e) => setSectorsInput(e.target.value)}
                    placeholder="Separe os setores por vírgula"
                    className="nexus-input"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-white">URL da Imagem</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className="nexus-input"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="nexus-button"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingAgent ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="nexus-card">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Descrição</TableHead>
                  <TableHead className="text-white">Setores</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {agent.name}
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs truncate">
                      {agent.shortDescription}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.sectors.slice(0, 2).map((sector, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                        {agent.sectors.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.sectors.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={agent.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(agent)}
                          size="sm"
                        />
                        <span className={`text-xs ${
                          agent.status === 'active' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {agent.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDialog(agent)}
                          className="text-white hover:bg-nexus-purple/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(agent.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {agents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum agente cadastrado</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AgentsManagement;
