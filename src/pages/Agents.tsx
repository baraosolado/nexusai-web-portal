
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search, Brain, Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Agent } from '@/types';
import { agentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const sectors = ['Saúde', 'Imobiliário', 'Jurídico', 'Financeiro', 'Consultoria'];

  useEffect(() => {
    loadAgents();
  }, [currentPage, selectedSector]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const response = await agentService.getActiveAgents(
        currentPage,
        12,
        selectedSector || undefined
      );
      setAgents(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agentes. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.sectors.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector === 'all' ? '' : sector);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-nexus-dark to-nexus-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Nossos <span className="gradient-text">Agentes de IA</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 animate-fade-in">
              Descubra nossa gama completa de agentes especializados, cada um projetado 
              para revolucionar um setor específico do seu negócio.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-nexus-light/20 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar agentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 nexus-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <Select value={selectedSector || 'all'} onValueChange={handleSectorChange}>
                <SelectTrigger className="w-48 nexus-input">
                  <SelectValue placeholder="Filtrar por setor" />
                </SelectTrigger>
                <SelectContent className="bg-nexus-light border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-nexus-purple/20">
                    Todos os Setores
                  </SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector} className="text-white hover:bg-nexus-purple/20">
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="nexus-card animate-pulse">
                  <div className="w-full h-48 bg-nexus-light/30 rounded-lg mb-4"></div>
                  <div className="h-6 bg-nexus-light/30 rounded mb-2"></div>
                  <div className="h-4 bg-nexus-light/30 rounded mb-4"></div>
                  <div className="h-4 bg-nexus-light/30 rounded mb-2"></div>
                  <div className="h-4 bg-nexus-light/30 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Nenhum agente encontrado
              </h3>
              <p className="text-gray-400">
                Tente ajustar seus filtros ou termo de busca.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAgents.map((agent, index) => (
                <div key={agent.id} className="nexus-card hover-scale animate-fade-in group">
                  <div className="w-full h-48 bg-accent-gradient rounded-lg mb-4 flex items-center justify-center">
                    <Brain className="h-16 w-16 text-white" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {agent.sectors.slice(0, 2).map((sector, idx) => (
                      <span key={idx} className="px-2 py-1 bg-nexus-purple/20 text-nexus-purple text-xs rounded-full">
                        {sector}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-nexus-purple transition-colors">
                    {agent.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 line-clamp-3">
                    {agent.shortDescription}
                  </p>
                  
                  <div className="mt-auto">
                    <Link to={`/agentes/${agent.slug}`}>
                      <Button className="w-full nexus-button group">
                        Ver Detalhes
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                    className={currentPage === index + 1 ? "nexus-button" : "border-nexus-purple text-nexus-purple hover:bg-nexus-purple hover:text-white"}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-nexus-light/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nexus-card text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Não encontrou o que procura?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Nossa equipe pode desenvolver soluções personalizadas para suas necessidades específicas.
            </p>
            <Link to="/contato">
              <Button className="nexus-button text-lg px-8 py-4 group">
                Falar com Especialista
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Agents;
