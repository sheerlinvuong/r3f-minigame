import usePlayer from "../stores/usePlayer";

export default function WinnerCard({ onRestart }) {
  const winner = usePlayer((state) => state.winner);

  return (
    <div className="fixed">
      <div className="center">
        <div className="player">
          <h3>{winner.label}</h3>
          <p className="winner">WINS</p>
        </div>
        <button className="restart" onClick={() => onRestart()}>
          Play again
        </button>
      </div>
    </div>
  );
}
