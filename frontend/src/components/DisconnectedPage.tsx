const DisconnectedPage = ({ handleReconnect }: { handleReconnect: () => void }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="flex flex-col items-center space-y-8 max-w-md mx-auto text-center">
        {/* 🚫 Disconnected Icon */}
        <div className="h-16 w-16 rounded-full bg-destructive flex items-center justify-center shadow-lg">
          <span className="text-white text-3xl">⚠️</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-foreground tracking-wide">
          Oops, You Are Disconnected!
        </h1>

        {/* Subtext */}
        <p className="text-lg text-muted-foreground">
          It seems like you've lost connection to the chat. Don't worry, we're here to help you reconnect. Click below to get back online.
        </p>

        {/* Reconnect Button */}
        <button
          className="w-full max-w-xs mt-4 rounded-xl bg-primary text-primary-foreground px-6 py-3 shadow-xl hover:bg-primary-dark transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleReconnect}
        >
          Try Reconnecting
        </button>

        {/* Retry Message */}
        <p className="text-sm text-muted-foreground mt-4">
          If you are still having issues, please check your internet connection or try again later.
        </p>
      </div>
    </div>
  );
};

export default DisconnectedPage;
