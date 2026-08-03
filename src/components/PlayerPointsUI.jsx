import usePlayer from "../stores/usePlayer";

const PlayerPoints = () => {
  const players = usePlayer((state) => state.players);
  const plates = players[0].collectedFood;

  return (
    <div className="points">
      <div className="left">
        <div className="player">
          <p>1P</p>
          <p>Final Score</p>
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
      <div className="right">2P</div>
    </div>
  );
};

export default PlayerPoints;
