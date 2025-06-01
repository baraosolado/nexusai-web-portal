
import React from 'react';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
          
          <div className="nexus-card space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Informações Coletadas</h2>
              <p className="text-gray-300 leading-relaxed">
                A NexusAI coleta informações pessoais quando você preenche nossos formulários de contato, 
                incluindo nome, email, telefone, empresa e mensagem. Também coletamos dados de navegação 
                para melhorar nossos serviços.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Uso das Informações</h2>
              <p className="text-gray-300 leading-relaxed">
                Utilizamos suas informações para entrar em contato sobre nossos serviços, enviar 
                materiais informativos e melhorar nossa plataforma. Não compartilhamos seus dados 
                com terceiros sem seu consentimento.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Proteção de Dados</h2>
              <p className="text-gray-300 leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Seus Direitos</h2>
              <p className="text-gray-300 leading-relaxed">
                Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. 
                Para exercer esses direitos, entre em contato conosco através do email 
                contato@nexusai.com.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                Utilizamos cookies para melhorar sua experiência de navegação e analisar o tráfego 
                do site. Você pode desativar os cookies nas configurações do seu navegador.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Atualizações da Política</h2>
              <p className="text-gray-300 leading-relaxed">
                Esta política pode ser atualizada periodicamente. Recomendamos que você a revise 
                regularmente para se manter informado sobre como protegemos suas informações.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contato</h2>
              <p className="text-gray-300 leading-relaxed">
                Para dúvidas sobre esta política de privacidade, entre em contato conosco:
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

export default PrivacyPolicy;
