export default function WinnerCard({ onRestart }) {
  return (
    <div>
      Winner!
      <button onClick={() => onRestart()}>Play again</button>
    </div>
  );
}
