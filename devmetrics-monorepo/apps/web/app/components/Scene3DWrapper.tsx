"use client";

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { 
  ssr: false 
});

export function Scene3DWrapper({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return <Scene3D className={className} style={style} />;
}
