import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

const Player = () => {
  // 카메라를 불러온다.
  const { camera } = useThree();
  // 구체형 모델을 불러온다. 질량은 1, 움직임이 가능함을 명시하고 지면에서 1만큼 떨어져있음
  // DOM에 접근할 ref와 변경사항이 반영될 api를 가져온다.
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 1, 0],
  }));

  const vel = useRef([0, 0, 0]);
  const pos = useRef([0, 0, 0]);

  // 구체의 속도에 변화가 생길 경우 변수에 입력
  useEffect(() => {
    api.velocity.subscribe((v) => (vel.current = v));
  }, [api.velocity]);

  // 구체의 위치에 변화가 생길 경우 변수에 입력
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  // 플레이어 시점을 구체 위치와 동기화하고, 한 프레임마다 공중으로 1만큼 뜬다.
  useFrame(() => {
    camera.position.copy(new Vector3(...pos.current));
    api.velocity.set(0, 1, 0);
  });

  return <mesh ref={ref}></mesh>;
};

export default Player;
