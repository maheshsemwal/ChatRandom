"use client"

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

export function CardsChat({ messages, sendMessage, connectedUser }: {
    messages: MessageTypes[],
    sendMessage: (message: string) => void,
    connectedUser: string | null
}) {
    
    const { user } = useUser()!
    const [input, setInput] = React.useState("")
    const inputLength = input.trim().length
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const isFirstRender = React.useRef(true)

    const [showConnectionMessage, setShowConnectionMessage] = React.useState(true)

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

    const getInitial = (name: string | null) => name ? name.charAt(0).toUpperCase() : "U"

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
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

            <CardContent className="flex-1 p-4 overflow-auto bg-primary-foreground">
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
                            <p>{message.message}</p>
                            <span className={cn(
                                "text-[10px] mt-1",
                                message.userId === user?.userId ? "text-white/80" : "text-muted-foreground"
                            )}>
                                {formatTime(message.timeStamp)}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </CardContent>

            <CardFooter className="p-2 bg-background border-t border-border h-20">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (inputLength === 0) return
                        sendMessage(input)
                        setInput("")
                    }}
                    className="flex w-full items-center space-x-2"
                >
                    {/* Emoji & File Upload */}
                    <div className="flex space-x-2">
                        <Button size="icon" variant="ghost" type="button">
                            <Smile className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" type="button">
                            <Paperclip className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Message Input */}
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex bg-background text-foreground border-none focus:ring-0"
                        autoComplete="off"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                    />

                    {/* Send Button */}
                    <Button type="submit" size="icon" className="bg-green-500 text-white scale-110" disabled={inputLength === 0}>
                        <Send />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
