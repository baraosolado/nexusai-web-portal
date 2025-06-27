
'use client'

import { useLazySpline } from '@/hooks/use-lazy-spline';
import { useEffect, useState } from 'react';

interface SplineSceneProps {
  scene: string
  className?: string
}

export const SplineScene = ({ scene, className }: SplineSceneProps) => {
  const { SplineComponent, isLoading, error, loadSpline } = useLazySpline();
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  const handleLoadRequest = () => {
    if (!hasStartedLoading) {
      setHasStartedLoading(true);
      loadSpline();
    }
  };

  // Auto-load quando o componente é montado
  useEffect(() => {
    handleLoadRequest();
  }, []);

  if (error) {
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
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-sm text-slate-400">Carregando experiência 3D...</span>
        </div>
      </div>
    );
  }

  return (
    <SplineComponent
      scene={scene}
      className={className}
    />
  );
};
