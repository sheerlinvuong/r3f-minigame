import useGame from "../stores/useGame.jsx";
import usePlayer from "../stores/usePlayer.jsx";

export default function Debug() {
  const phase = useGame((state) => state.phase);
  const start = useGame((state) => state.start);

  const players = usePlayer((state) => state.players);
  const calculateScore = usePlayer((state) => state.calculateScore);

  return (
    <div className="debug">
      <span>{players[0].collectedFood}</span>
      <span>{players[0].score}</span>
      <span>{players[1].score}</span>
      <span>{phase}</span>
      <button
        onClick={() => {
          start();
        }}
      >
        Start
      </button>

      <button
        onClick={() => {
          calculateScore();
        }}
      >
        calculateScore
      </button>
    </div>
  );
}
