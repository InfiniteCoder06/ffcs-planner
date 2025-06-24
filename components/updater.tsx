export async function Updater({ version }: { version: string }) {
  const data = await fetch(
    process.env.NODE_ENV === "production"
      ? "https://your-production-domain.com/api/version"
      : "http://localhost:3000/api/version",
  );
  if (!data.ok) {
    <div>
      <p>Error fetching version information.</p>
      <p>Status: {data.status}</p>
      <p>Status Text: {data.statusText}</p>
    </div>;
  }
  const serverVersion = await data.json();

  return (
    <div>
      {version != serverVersion.version ? (
        <>
          <h2>Update Available</h2>
          <p>
            A new version of the app is available. Please refresh the page to
            update.
          </p>
        </>
      ) : (
        <p>Your app is up to date.</p>
      )}
    </div>
  );
}
