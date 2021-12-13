import React, { useRef } from "react"

import { Environment } from "@react-three/drei"
import { DirectionalLight } from "three"

const Lighting = () => {
  const directionalLightRef = useRef<DirectionalLight>()
  // useHelper(directionalLightRef, DirectionalLightHelper, 10)

  return (
    <>
      <directionalLight
        ref={directionalLightRef}
        position={[25, 100, 50]}
        intensity={0.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-near={5}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <Environment files="environment/immenstadter_horn_1k.hdr" />
    </>
  )
}

export default Lighting
