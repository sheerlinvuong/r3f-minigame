import { useEffect } from "react";
import useGame from "../stores/useGame";
import IntroCard from "./IntroCard";
import PlayerPoints from "./PlayerPointsUI";
import WinnerCard from "./WinnerCard";
import usePlayer from "../stores/usePlayer";

// Game loop
//1. Intro card                             Ready -> Set countdown
//3. Timer start                            countdown
//2. Countdown 321...Start! Food appears    Playing
//4. Timer End                              Set Ended
//5. Calculate winner                       Ended -> Set Ready
//5. restart/ intro card

//player cannot move until playing

export default function GameManager() {
  const phase = useGame((state) => state.phase);

  const start = useGame((state) => state.start);
  const beginPlaying = useGame((state) => state.beginPlaying);
  const endPlaying = useGame((state) => state.endPlaying);
  const restart = useGame((state) => state.restart);

  const calculateScore = usePlayer((state) => state.calculateScore);
  const resetScore = usePlayer((state) => state.resetScore);

  useEffect(() => {
    if (phase !== "countdown") return;

    const timer = setTimeout(beginPlaying, 3000);

    return () => clearTimeout(timer);
  }, [phase, beginPlaying]);

  useEffect(() => {
    if (phase !== "playing") return;

    const timer = setTimeout(() => {
      endPlaying();
      calculateScore();
    }, 15000);

    return () => clearTimeout(timer);
  }, [phase, endPlaying]);

  return (
    <div className="main">
      {phase === "ready" && <IntroCard onStart={start} />}

      {(phase !== "ready" || phase !== "countdown") && <PlayerPoints />}

      {phase === "countdown" && <Countdown />}

      {phase === "winner" && (
        <WinnerCard
          onRestart={() => {
            restart();
            resetScore();
          }}
        />
      )}
    </div>
  );
}

const Countdown = () => {
  return <div>321</div>;
};
