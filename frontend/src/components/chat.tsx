"use client"

import * as React from "react"
import { Send } from "lucide-react"
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

export function CardsChat() {
    const [messages, setMessages] = React.useState([
        { role: "agent", content: "Hi, how can I help you today?" },
        { role: "agent", content: "Hi, how can I help you today?" },
    ])
    const [input, setInput] = React.useState("")
    const inputLength = input.trim().length
    const messagesEndRef = React.useRef<HTMLDivElement>(null)
    const isFirstRender = React.useRef(true)

    // Scroll to latest message
    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: isFirstRender.current ? "auto" : "smooth",
            })
            isFirstRender.current = false 
        }
    }, [messages])

    return (
        <Card className="h-screen flex flex-col shadow-md rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center p-4 bg-gray-100 border-b">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src="/avatars/01.png" alt="Image" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">Annonymous</p>
                        <p className="text-xs text-gray-500">m@example.com</p>
                    </div>
                </div>
            </CardHeader>

          
            <CardContent className="flex-1 p-4 overflow-auto bg-white">
                <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm shadow-sm",
                                message.role === "user"
                                    ? "ml-auto bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-900"
                            )}
                        >
                            {message.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-gray-100 border-t">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (inputLength === 0) return
                        setMessages([...messages, { role: "user", content: input }])
                        setInput("")
                    }}
                    className="flex w-full items-center space-x-2"
                >
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1 border rounded-lg p-2"
                        autoComplete="off"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                    />
                    <Button type="submit" size="icon" disabled={inputLength === 0}>
                        <Send />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
