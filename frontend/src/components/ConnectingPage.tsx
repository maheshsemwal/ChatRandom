const ConnectingPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-3xl">
        <div className="flex flex-col gap-8 items-center text-center">
          {/* Animated Spinner */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary shadow-xl mb-6"></div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-foreground tracking-wide">
            Connecting You to Someone...
          </h1>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground mt-4">
            We're finding the perfect connection for you. Please hold on, it won't be long!
          </p>

          {/* Helpful Tip or Extra Note */}
          <p className="text-sm text-muted-foreground mt-2">
            If it's taking too long, please check your internet connection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectingPage;
