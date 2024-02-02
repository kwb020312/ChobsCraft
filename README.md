# ChobsCraft

[플레이하기](https://chobs-craft.vercel.app)

- `1~5 숫자 패드`: 블록 선택
- `스페이스바`: 점프
- `클릭`: 블록 설치
- `Alt`+`클릭`: 블록 제거

마인크래프트를 ThreeJS로 구현하며 연습해보자

> OpenSSL 과 관련한 오류가 발생하는 점을 확인하였으며, [해당 게시물](https://velog.io/@kwb020312/%EC%95%8C%EA%B2%8C%EB%90%9C-%EA%B2%83-ERROSSLEVPUNSUPPORTED-%EC%98%A4%EB%A5%98-NODE-%EB%B2%84%EC%A0%84-%EB%8B%A4%EC%9A%B4%ED%95%98%EC%A7%80%EB%A7%88)을 통해

```
윈도우
set NODE_OPTIONS=--openssl-legacy-provider

Mac, Linux
export NODE_OPTIONS=--openssl-legacy-provider
```

해결 방법을 조회할 수 있음

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

## 👨‍🦰플레이어 이동

```javascript
// 앞뒤 방향 벡터
const frontVector = new Vector3(
  0,
  0,
  (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
);

// 좌우 방향 벡터
const sideVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);

// 1. 전진벡터 - 좌우 벡터를 통해 최종 방향 결정 ex) 앞 우측대각
// 2. 방향 벡터를 단위 벡터로 변경
// 3. 해당 벡터에 속도를 곱함
// 4. 벡터에 따른 카메라 회전을 적용
direction
  .subVectors(frontVector, sideVector)
  .normalize()
  .multiplyScalar(SPEED)
  .applyEuler(camera.rotation);
```

## 😥카메라 이동

fiber와 drei를 활용해 쉽게 활용 가능하다.

```jsx
import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const FPV = () => {
  const { camera, gl } = useThree();
  return <PointerLockControls args={[camera, gl.domElement]} />;
};

export default FPV;
```

## 🙄블록 생성

![image](https://github.com/kwb020312/ChobsCraft/assets/46777310/ae382c55-0b79-47cb-a1c3-5c6fdf81e378)

cannon을 활용해 간단한 박스 생성이 가능하다.

```jsx
const Cube = ({ position, texture }) => {
  // 정지해있는 박스 mesh 생성
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));
  const activeTexture = textures[texture + "Texture"];

  return (
    // 박스 형태의 지오메트리와 마테리얼로 해당 메시를 구성함
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial map={activeTexture} attach="material" />
    </mesh>
  );
};
```

## 🤐블록 제거

```jsx
<mesh
  onClick={(e) => {
    e.stopPropagation();
    const clickedFace = Math.floor(e.faceIndex / 2);
    const { x, y, z } = ref.current.position;
    if (e.altKey) removeCube(x, y, z);
    else if (clickedFace === 0) addCube(x + 1, y, z);
    else if (clickedFace === 1) addCube(x - 1, y, z);
    else if (clickedFace === 2) addCube(x, y + 1, z);
    else if (clickedFace === 3) addCube(x, y - 1, z);
    else if (clickedFace === 4) addCube(x, y, z + 1);
    else if (clickedFace === 5) addCube(x, y, z - 1);
  }}
  ref={ref}
>
  <boxBufferGeometry attach="geometry" />
  <meshStandardMaterial map={activeTexture} attach="material" />
</mesh>
```

mesh 객체는 클릭 이벤트로 `e.point`(Vector3 생성자로 X, Y, Z 좌표를 나타냄)와 `e.faceIndex`(해당 mesh의 선택 면, 즉 좌 우 앞 뒤 위 아래)를 얻을 수 있으며, 위 코드에서 선택된 면을 2로 나눈 이유는 객체 내부부터 순차적으로 1,2 ... 외부 7,8,9,.. 의 형식으로 번호가 매겨지기 때문이다.

## 🎄블록 포커싱

![image](https://github.com/kwb020312/ChobsCraft/assets/46777310/56bf2612-621d-4c0c-ae9a-b73d7668374a)

```jsx
<mesh
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
...
```

`mesh` 태그는 마우스 포인터가 해당 메시를 향해 있는지 확인하는 이벤트인 `PointerMove`와 `PointerOut`이 있으며 이에 따른

```jsx
<meshStandardMaterial
        color={isHovered ? "gray" : "white"}
...
```

`Material` 색상을 변경하여 어떠한 블록이 포커싱 되고있는지 구분하였음
