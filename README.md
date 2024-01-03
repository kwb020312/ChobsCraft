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
