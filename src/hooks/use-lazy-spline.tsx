
import { useState, useCallback, useRef } from 'react'

export const useLazySpline = () => {
  const [SplineComponent, setSplineComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const loadSpline = useCallback(async () => {
    // Evita múltiplas tentativas de carregamento
    if (hasLoadedRef.current || isLoading) {
      console.log('Spline: Carregamento já iniciado ou componente já carregado');
      return;
    }

    console.log('Spline: Iniciando carregamento do componente');
    hasLoadedRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Carregamento dinâmico completo - sem pre-bundling
      const splineModule = await import('@splinetool/react-spline');
      console.log('Spline: Componente carregado com sucesso');
      setSplineComponent(() => splineModule.default);
    } catch (err) {
      console.error('Spline: Erro ao carregar componente:', err);
      setError('Falha ao carregar o componente 3D');
      hasLoadedRef.current = false; // Permite tentar novamente em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, []); // Removendo dependências para evitar re-criação

  return { SplineComponent, isLoading, error, loadSpline };
};
