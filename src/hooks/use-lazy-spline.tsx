import { useState, useEffect, useRef, useCallback, ComponentType } from 'react'

const useLazySpline = () => {
  const [SplineComponent, setSplineComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Preload apenas quando o usuário mostrar intenção de interagir
  const preloadSpline = useCallback(async () => {
    if (isPreloaded || SplineComponent) return;

    setIsPreloaded(true);
    try {
      // Preload silencioso em background
      await import('@splinetool/react-spline');
    } catch (err) {
      console.warn('Preload do Spline falhou:', err);
    }
  }, [isPreloaded, SplineComponent]);

  const loadSpline = useCallback(async () => {
    if (SplineComponent || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { default: Spline } = await import('@splinetool/react-spline');
      setSplineComponent(() => Spline);
    } catch (err) {
      console.error('Erro ao carregar Spline:', err);
      setError('Falha ao carregar o componente 3D');
    } finally {
      setIsLoading(false);
    }
  }, [SplineComponent, isLoading]);

  return { SplineComponent, isLoading, error, loadSpline, preloadSpline };
};