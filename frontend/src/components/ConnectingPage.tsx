const ConnectingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Animated Spinner */}
            <div
              className="h-12 w-12 animate-spin rounded-full border-[3px] border-muted border-t-primary"
            ></div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-foreground">
              Connecting...
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground">
              Please wait while we connect you to the chat server.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectingPage
