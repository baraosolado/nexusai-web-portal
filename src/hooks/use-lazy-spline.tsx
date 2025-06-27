import { useState, useCallback } from 'react'

export const useLazySpline = () => {
  const [SplineComponent, setSplineComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSpline = useCallback(async () => {
    if (SplineComponent || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Carregamento dinâmico completo - sem pre-bundling
      const splineModule = await import('@splinetool/react-spline');
      setSplineComponent(() => splineModule.default);
    } catch (err) {
      console.error('Erro ao carregar Spline:', err);
      setError('Falha ao carregar o componente 3D');
    } finally {
      setIsLoading(false);
    }
  }, [SplineComponent, isLoading]);

  return { SplineComponent, isLoading, error, loadSpline };
};