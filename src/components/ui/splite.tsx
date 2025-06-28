
'use client'

import { useLazySpline } from '@/hooks/use-lazy-spline';
import { useEffect, useState, useRef } from 'react';

interface SplineSceneProps {
  scene: string
  className?: string
}

export const SplineScene = ({ scene, className }: SplineSceneProps) => {
  const { SplineComponent, isLoading, error, loadSpline } = useLazySpline();
  const [hasStartedLoading, setHasStartedLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const handleLoadRequest = async () => {
      if (!hasStartedLoading && mountedRef.current) {
        console.log('SplineScene: Iniciando carregamento automático');
        setHasStartedLoading(true);
        await loadSpline();
      }
    };

    // Pequeno delay para evitar carregamento imediato que pode causar problemas
    const timeoutId = setTimeout(handleLoadRequest, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  }, []); // Array vazio para executar apenas uma vez

  if (error) {
    console.log('SplineScene: Renderizando erro:', error);
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️</div>
          <span className="text-sm text-red-300">{error}</span>
        </div>
      </div>
    );
  }

  if (isLoading || !SplineComponent) {
    console.log('SplineScene: Renderizando loading, isLoading:', isLoading, 'SplineComponent:', !!SplineComponent);
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-sm text-slate-400">Carregando experiência 3D...</span>
        </div>
      </div>
    );
  }

  console.log('SplineScene: Renderizando componente Spline com scene:', scene);
  return (
    <SplineComponent
      scene={scene}
      className={className}
    />
  );
};
