export default function LoadingBlock({ text = "Caricamento..." }) {
  return (
    <div className="loading-block">
      <div className="spinner-border" role="status" aria-label="loading" />
      <p className="mt-2">{text}</p>
    </div>
  );
}
