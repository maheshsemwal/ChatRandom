const DisconnectedPage = ({ handleReconnect }: { handleReconnect: () => void }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 md:p-10">
      <h1 className="text-3xl font-bold text-foreground">Disconnected</h1>
      <p className="mt-4 text-center text-muted-foreground">
        You have been disconnected from the chat. Click below to reconnect.
      </p>
      <button
        className="mt-6 rounded-xl bg-primary text-primary-foreground px-6 py-3 shadow hover:opacity-90 transition"
        onClick={handleReconnect}
      >
        Reconnect
      </button>
    </div>
  );
};

export default DisconnectedPage;
