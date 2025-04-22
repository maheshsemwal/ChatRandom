import * as React from "react"
import { Send, Paperclip, Smile, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageTypes } from "@/types/types"
import { useUser } from "@/context/UserProvider"
import { useDropzone } from "react-dropzone"
import FilePreviewBox from "./filePreviewBox"
import { sendFile } from "@/actions/action"
import ImagePreview from "./ImagePreview"

export function CardsChat({
    messages,
    socket,
    connectedUser,
}: {
    messages: MessageTypes[]
    socket: WebSocket | null
    connectedUser: string | null
}) {
    const { user } = useUser()!
    const [input, setInput] = React.useState("")
    const [file, setFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const [showConnectionMessage, setShowConnectionMessage] = React.useState(true)
    const [ImagePreviewOpen, setImagePreviewOpen] = React.useState(false)
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(null)
    const [sending, setSending] = React.useState(false)

    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const isFirstRender = React.useRef(true)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowConnectionMessage(false)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: isFirstRender.current ? "auto" : "smooth",
            })
            isFirstRender.current = false
        }
    }, [messages])

    React.useEffect(() => {
        if (!previewUrl) return
        return () => URL.revokeObjectURL(previewUrl)
    }, [previewUrl])

    const handleFileUpload = (selectedFile: File) => {
        if (!selectedFile) return
        setFile(selectedFile)
        const fileUrl = URL.createObjectURL(selectedFile)
        setPreviewUrl(fileUrl)
    }

    const { getRootProps } = useDropzone({
        onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles[0]),
        accept: {
            "image/*": [],
            "application/pdf": [],
        },
        multiple: false,
    })

    const getInitial = (name: string | null) => (name ? name.charAt(0).toUpperCase() : "U")

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    }

    const sendMessage = async (message: string) => {
        if ((!message.trim() && !file) || !socket || socket.readyState !== WebSocket.OPEN) return

        // Clear immediately
        setInput("")
        setPreviewUrl(null)
        setFile(null)
        setImagePreviewOpen(false)
        setSending(true)

        try {
            let messageData: string | undefined = undefined

            if (file) {
                const result = await sendFile(file)
                if (result.error) {
                    console.log(result.error)
                    return
                }

                messageData = JSON.stringify({
                    type: "MESSAGE",
                    content: {
                        userId: user?.userId,
                        message: { file: result.fileUrl, text: message },
                        timeStamp: Date.now(),
                    },
                })
            } else {
                messageData = JSON.stringify({
                    type: "MESSAGE",
                    content: {
                        userId: user?.userId,
                        message,
                        timeStamp: Date.now(),
                    },
                })
            }

            socket.send(messageData)

        } catch (error) {
            console.error("Error sending message:", error)
        } finally {
            setSending(false)
        }
    }

    return (
        <Card className="h-screen flex flex-col shadow-lg rounded-2xl overflow-hidden bg-background text-foreground border-2 border-gray-600">
            <CardHeader className="flex flex-row items-center p-4 bg-background bg-opacity-70 backdrop-blur-xl border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <Avatar className="transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 cursor-pointer">
                        <AvatarImage src="/avatars/01.png" alt="Image" />
                        <AvatarFallback>{getInitial(connectedUser)}</AvatarFallback>
                    </Avatar>
                    <div className="text-white space-y-1">
                        <p className="text-xl font-bold tracking-wider">{connectedUser}</p>
                        <p className="text-sm text-gray-300">Online</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent
                className="flex-1 p-4 overflow-auto bg-gradient-to-tl from-blue-900 via-purple-800 to-pink-700 text-white rounded-lg"
                style={{
                    backgroundImage: "url('/assets/futuristic-pattern.svg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.9)",
                }}
                {...getRootProps()}
            >
                <div className="flex flex-col space-y-4">
                    {showConnectionMessage && (
                        <div className="bg-blue-900 text-white text-center p-3 rounded-lg shadow-xl">
                            You are connected to <span className="font-semibold">{connectedUser}</span>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "max-w-[80%] flex flex-col gap-2 rounded-xl px-5 py-3 text-sm shadow-lg transition-all",
                                message.userId === user?.userId
                                    ? "bg-gradient-to-r from-green-500 to-green-700 text-white self-end"
                                    : "bg-gradient-to-r from-gray-600 to-gray-800 text-gray-200 self-start"
                            )}
                        >
                            <div>
                                {typeof message.message === "string" ? (
                                    message.message
                                ) : (
                                    <div>
                                        <img
                                            src={message.message.file}
                                            alt="file"
                                            className="w-32 h-32 object-cover rounded-lg mb-3 cursor-pointer transition-all transform hover:scale-110"
                                            onClick={() => {
                                                if (typeof message.message !== "string") {
                                                    setImagePreviewUrl(message.message.file)
                                                }
                                                setImagePreviewOpen(true)
                                            }}
                                        />
                                        <div className="text-sm text-muted-foreground">
                                            {message.message.text.length > 50
                                                ? message.message.text.slice(0, 50) + "..."
                                                : message.message.text}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-xs mt-1 opacity-75",
                                    message.userId === user?.userId ? "text-white" : "text-gray-300"
                                )}
                            >
                                {formatTime(message.timeStamp)}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-background border-t border-gray-700 flex items-center justify-between space-x-4">
                <form
                    onSubmit={async (event) => {
                        event.preventDefault()
                        await sendMessage(input)
                    }}
                    className="flex w-full items-center space-x-4"
                >
                    <div className="flex space-x-3">
                        <Button size="icon" variant="ghost" type="button" className="hover:bg-blue-700 transition-all duration-200">
                            <Smile className="w-6 h-6 text-blue-600" />
                        </Button>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(event) => {
                                const selectedFile = event.target.files?.[0]
                                if (selectedFile) {
                                    handleFileUpload(selectedFile)
                                }
                                event.target.value = ""
                            }}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            className="hover:bg-blue-700 transition-all duration-200"
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            <Paperclip className="w-6 h-6 text-blue-600" />
                        </Button>
                    </div>

                    <div className="flex-1 relative">
                        {previewUrl && (
                            <div className="absolute -top-28 left-0 z-10">
                                <FilePreviewBox
                                    file={previewUrl}
                                    onClose={() => {
                                        setPreviewUrl(null)
                                        setFile(null)
                                    }}
                                />
                            </div>
                        )}
                        <Input
                            id="message"
                            placeholder="Type your message..."
                            className="bg-gray-800 text-white rounded-xl shadow-lg focus:ring focus:ring-blue-400 hover:bg-gray-700 transition-all duration-200"
                            autoComplete="off"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        size="icon"
                        className={cn(
                            "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-110 transition-all duration-200",
                            sending && "cursor-not-allowed opacity-70"
                        )}
                        disabled={!input.trim() && !file || sending}
                    >
                        {sending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>

            {ImagePreviewOpen && imagePreviewUrl && (
                <ImagePreview
                    imageUrl={imagePreviewUrl}
                    onClose={() => {
                        setImagePreviewOpen(false)
                        setImagePreviewUrl(null)
                    }}
                />
            )}
        </Card>
    )
}
