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

const PlayerPoints = () => {
  const phase = useGame((state) => state.phase);

  const players = usePlayer((state) => state.players);
  const plates = players[0].collectedFood;

  const showScore = phase === "results" || phase === "winner";
  const finalScore = players[0].score;

  return (
    <div className="points">
      <div className="left">
        <div className="player">
          <h3>1P</h3>
          {showScore && <AnimatedScore score={finalScore} />}
        </div>

        <div className="plates">
          {plates.length >= 1 &&
            plates.map((item, i) => {
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
    </div>
  );
};

export default PlayerPoints;
