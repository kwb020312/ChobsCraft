import { useStore } from "../hooks/useStore";

const Menu = () => {
  const [saveWorld, resetWorld] = useStore((state) => [
    state.saveWorld,
    state.resetWorld,
  ]);
  return (
    <div className="menu absolute">
      <button onClick={() => saveWorld()}>💾저장</button>
      <button onClick={() => resetWorld()}>💣초기화</button>
    </div>
  );
};

export default Menu;
