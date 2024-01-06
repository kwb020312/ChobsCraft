import { useBox } from "@react-three/cannon";
import { useStore } from "../hooks/useStore";
import * as textures from "../images/textures";

const Cube = ({ position, texture }) => {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));
  const activeTexture = textures[texture + "Texture"];

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial map={activeTexture} attach="material" />
    </mesh>
  );
};

const Cubes = () => {
  const [cubes] = useStore((state) => [state.cubes]);
  return cubes.map(({ key, pos, texture }) => (
    <Cube position={pos} texture={texture} />
  ));
};

export default Cubes;
