const ErrorPage = () => {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-lg text-center space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center items-center rounded-full bg-destructive h-20 w-20 mb-6">
            <span className="text-white text-3xl">❌</span>
          </div>
  
          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-foreground tracking-wide">
            Oops! Something Went Wrong
          </h1>
  
          {/* Subtext */}
          <p className="text-lg text-muted-foreground">
            We encountered an issue. Please try again later or contact support if the problem persists.
          </p>
  
          {/* Retry or Home Button */}
          <div className="flex gap-4 justify-center">
            <button
              className="rounded-lg bg-primary text-primary-foreground px-6 py-3 shadow-lg hover:opacity-90 transition-all"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <a
              href="/"
              className="rounded-lg bg-secondary text-secondary-foreground px-6 py-3 shadow-lg hover:opacity-90 transition-all"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default ErrorPage;
  