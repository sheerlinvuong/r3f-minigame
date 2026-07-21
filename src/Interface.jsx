import useGame from "./stores/useGame";

export default function Interface() {
  const phase = useGame((state) => state.phase);
  const start = useGame((state) => state.start);

  return (
    <div className="interface">
      <div> {phase}</div>
      {phase === "ready" && (
        <>
          <div className="intro">
            <h1>Sushi-go-round</h1>
            <p>Press the A button to eat the sushi.</p>
            <p>The biggest spender wins.</p>
            <p>Eat the same kind in a row to score more points.</p>
            <div className="price-list">
              <div>£5.60</div>
              <div>£5.00</div>
              <div>£4.80</div>
              <div>£4.10</div>
              <div>£3.50</div>
              <div>£3.20</div>
              <div>£3.00</div>
              <div>£2.30</div>
            </div>
          </div>
          <div className="start">
            <button
              onClick={() => {
                start();
              }}
            >
              Start
            </button>
          </div>
        </>
      )}
    </div>
  );
}
