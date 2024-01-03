# ChobsCraft

마인크래프트를 ThreeJS로 구현하며 연습해보자

## 😊텍스쳐 맵핑

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
