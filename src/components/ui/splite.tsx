
'use client'

import { Suspense, lazy, memo } from 'react'

// Lazy load mais agressivo do Spline
const Spline = lazy(() => 
  import('@splinetool/react-spline').then(module => ({
    default: module.default
  }))
)

interface SplineSceneProps {
  scene: string
  className?: string
}

const SplineScene = memo(({ scene, className }: SplineSceneProps) => {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-sm text-slate-400">Carregando experiência 3D...</span>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
})

SplineScene.displayName = 'SplineScene'

export { SplineScene }
