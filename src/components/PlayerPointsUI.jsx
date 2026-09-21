import usePlayer from "../stores/usePlayer";
import useGame from "../stores/useGame";
import { useState, useEffect } from "react";

const SCORE_PER_SECOND = 10;

function AnimatedScore({ score }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = (score / SCORE_PER_SECOND) * 1000;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);

      setDisplayScore(score * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(score);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return <p className="score">£{displayScore.toFixed(2)}</p>;
}

const PlayerPoints = ({ player, showScore, playerOrder }) => {
  const horiPlacement = playerOrder % 2 === 0 ? "leftPoints" : "rightPoints";
  const vertPlacement = playerOrder >= 2 ? "topPoints" : "bottomPoints";

  return (
    <div className={`${horiPlacement} ${vertPlacement}`}>
      <div className="playerLabel">
        <h3 style={{ backgroundColor: `${player.colour}` }}>{player.label}</h3>
        {showScore && <AnimatedScore score={player.score} />}
      </div>

      <div
        className={`plates ${horiPlacement === "rightPoints" ? "plates--reversed" : ""}`}
      >
        {player.collectedFood.length >= 1 &&
          player.collectedFood.map((_, i) => {
            const column = Math.floor(i / 5) + 1;
            const row = 5 - (i % 5);
            return (
              <img
                key={i}
                src="../assets/images/plate.png"
                style={{
                  gridColumn: column,
                  gridRow: row,
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

const PlayerPointsUI = () => {
  const phase = useGame((state) => state.phase);
  const showScore = phase === "results" || phase === "winner";

  const players = usePlayer((state) => state.players);

  return (
    <div className="points">
      {players.map((player, i) => {
        return (
          <PlayerPoints
            key={player.id}
            playerOrder={i}
            player={player}
            showScore={showScore}
          />
        );
      })}
    </div>
  );
};

export default PlayerPointsUI;
