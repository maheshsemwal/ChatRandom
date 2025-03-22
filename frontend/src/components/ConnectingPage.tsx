
const connectingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 md:p-10">  
    <div className="w-full max-w-sm md:max-w-3xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold text-foreground">Connecting...</h1>
          <p className="text-balance text-muted-foreground">
            Please wait while we connect you to the chat server
          </p>
        </div>
      </div>
    </div> 
  </div>
  )
}

export default connectingPage