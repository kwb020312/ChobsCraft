# ChobsCraft

마인크래프트를 ThreeJS로 구현하며 연습해보자

> OpenSSL 과 관련한 오류가 발생하는 점을 확인하였으며, [해당 게시물](https://velog.io/@kwb020312/%EC%95%8C%EA%B2%8C%EB%90%9C-%EA%B2%83-ERROSSLEVPUNSUPPORTED-%EC%98%A4%EB%A5%98-NODE-%EB%B2%84%EC%A0%84-%EB%8B%A4%EC%9A%B4%ED%95%98%EC%A7%80%EB%A7%88)을 통해 해결 방법을 조회할 수 있음

## 😊텍스쳐 맵핑

![image](https://github.com/kwb020312/ChobsCraft/assets/46777310/61b9d080-8b21-4622-a5cf-ce4abe609b45)

```jsx
const Ground = () => {
  // ref는 평면형을 사용할 것이며, 회전은 x축을 반시계 방향 60도 외에 모두 기본
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 4, 0, 0],
    position: [0, 0, 0],
  }));

  // 텍스쳐 필터는 기본 필터로 x,y를 100*100 사이즈로 텍스쳐 확장 없이 반복시킨다.
  groundTexture.magFilter = NearestFilter;
  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;
  groundTexture.repeat.set(100, 100);

  return (
    // 100*100 크기의 평면형 지오메트리에 기본 표면 메터리얼을 사용하며 이전 텍스쳐를 맵핑시킨다.
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  );
};
```

## 🤗플레이어 시점 생성

![image](https://github.com/kwb020312/ChobsCraft/assets/46777310/c0cb603a-0fbd-4a4d-be7a-a3a65679986d)

```javascript
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
```
