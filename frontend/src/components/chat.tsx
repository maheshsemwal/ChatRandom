import * as React from "react"
import { Send, Paperclip, Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
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
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const isFirstRender = React.useRef(true)

    const inputLength = input.trim().length

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

    // Cleanup preview URL when it changes or on unmount
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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles[0]),
        accept: {
            'image/*': [],
            'application/pdf': [],
        },
        multiple: false,
    })

    const getInitial = (name: string | null) => (name ? name.charAt(0).toUpperCase() : "U")

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    }

    const sendMessage = async (message: string) => {
        if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) return

        let messageData: string | undefined = undefined
        try {
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
            setFile(null)
            setPreviewUrl(null)
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    return (
        <Card className="h-screen flex flex-col shadow-md rounded-lg overflow-hidden bg-background text-foreground">
            <CardHeader className="flex flex-row items-center p-4 bg-background border-b border-border">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src="/avatars/01.png" alt="Image" />
                        <AvatarFallback>{getInitial(connectedUser)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-lg font-semibold">{connectedUser}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-auto bg-primary-foreground" {...getRootProps()}>
                {/* <input {...getInputProps()} /> */}
                <div className="flex flex-col space-y-4">
                    {showConnectionMessage && (
                        <div className="bg-green-100 text-green-800 text-center p-2 rounded">
                            You are connected to <span className="font-semibold">{connectedUser}</span>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm shadow-sm",
                                message.userId === user?.userId
                                    ? "bg-green-800 text-white self-end"
                                    : "bg-muted text-muted-foreground self-start"
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
                                            className="w-32 h-32 object-cover rounded-md mb-2 cursor-pointer"
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
                                    "text-[10px] mt-1",
                                    message.userId === user?.userId ? "text-white/80" : "text-muted-foreground"
                                )}
                            >
                                {formatTime(message.timeStamp)}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </CardContent>

            <CardFooter className="p-2 bg-background border-t border-border h-20">
                <form
                    onSubmit={async (event) => {
                        event.preventDefault()
                        if (inputLength === 0) return
                        await sendMessage(input)
                        setInput("")
                    }}
                    className="flex w-full items-center space-x-2"
                >
                    {/* Emoji & File Upload */}
                    <div className="flex space-x-2">
                        <Button size="icon" variant="ghost" type="button">
                            <Smile className="w-5 h-5" />
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
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            <Paperclip className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                        {previewUrl && (
                            <div className="absolute -top-32 left-0 z-10">
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
                            className="flex bg-background text-foreground border-none focus:ring-0"
                            autoComplete="off"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                        />
                    </div>

                    {/* Send Button */}
                    <Button
                        type="submit"
                        size="icon"
                        className="bg-green-500 text-white scale-110"
                        disabled={inputLength === 0}
                    >
                        <Send />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
            {ImagePreviewOpen && imagePreviewUrl && <ImagePreview imageUrl={imagePreviewUrl} onClose={() => { 
                setImagePreviewOpen(false)
                setImagePreviewUrl(null)
                 }} />}
        </Card>
    )
}
