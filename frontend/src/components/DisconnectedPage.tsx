const DisconnectedPage = ({ handleReconnect }: { handleReconnect: () => void }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="flex flex-col items-center space-y-6">
        {/* 🚫 Disconnected Icon */}
        <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center">
          <span className="text-white text-xl">⚠️</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground">Disconnected</h1>

        {/* Subtext */}
        <p className="text-lg text-muted-foreground text-center">
          You have been disconnected from the chat. Click below to reconnect.
        </p>

        {/* Reconnect Button */}
        <button
          className="rounded-lg bg-primary text-primary-foreground px-6 py-3 shadow-lg hover:opacity-90 transition-all"
          onClick={handleReconnect}
        >
          Reconnect
        </button>
      </div>
    </div>
  );
};

export default DisconnectedPage;
