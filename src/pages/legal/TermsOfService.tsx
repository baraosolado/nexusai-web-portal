
import React from 'react';
import Layout from '@/components/layout/Layout';

const TermsOfService: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Termos de Uso</h1>
          
          <div className="nexus-card space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-300 leading-relaxed">
                Ao acessar e utilizar a plataforma NexusAI, você concorda com estes termos de uso. 
                Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Descrição dos Serviços</h2>
              <p className="text-gray-300 leading-relaxed">
                A NexusAI oferece soluções de inteligência artificial especializadas para diversos 
                setores. Nossos agentes de IA são projetados para otimizar processos e maximizar 
                resultados empresariais.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Uso Permitido</h2>
              <p className="text-gray-300 leading-relaxed">
                Você pode utilizar nossos serviços apenas para fins legítimos e comerciais. 
                É proibido usar a plataforma para atividades ilegais, prejudiciais ou que 
                violem direitos de terceiros.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Propriedade Intelectual</h2>
              <p className="text-gray-300 leading-relaxed">
                Todos os direitos de propriedade intelectual relacionados aos nossos agentes de IA, 
                tecnologia e conteúdo são de propriedade da NexusAI. É proibida a reprodução 
                não autorizada.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Limitação de Responsabilidade</h2>
              <p className="text-gray-300 leading-relaxed">
                A NexusAI não se responsabiliza por danos indiretos, incidentais ou consequenciais 
                decorrentes do uso de nossos serviços. Nossa responsabilidade é limitada ao valor 
                pago pelos serviços.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Modificações dos Termos</h2>
              <p className="text-gray-300 leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. As alterações 
                entrarão em vigor imediatamente após a publicação na plataforma.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Rescisão</h2>
              <p className="text-gray-300 leading-relaxed">
                Podemos rescindir ou suspender o acesso aos nossos serviços a qualquer momento, 
                sem aviso prévio, por violação destes termos ou por qualquer motivo legítimo.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Lei Aplicável</h2>
              <p className="text-gray-300 leading-relaxed">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida 
                nos tribunais competentes do Brasil.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contato</h2>
              <p className="text-gray-300 leading-relaxed">
                Para dúvidas sobre estes termos de uso, entre em contato:
                <br />
                Email: contato@nexusai.com
                <br />
                Telefone: +55 (11) 9999-9999
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-gray-400 text-sm">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
