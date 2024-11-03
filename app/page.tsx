'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PhoneCall, Plus, Home, Tv, Users, Settings, Image, Send } from 'lucide-react'
import Pusher from 'pusher-js'
import { useEffect } from 'react'
import { Edit, Link as LinkIcon, Filter, BarChart2, RefreshCw, ClipboardList, Trash2 } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Initialize Pusher
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
  cluster: 'ap1'
})

interface Message {
  id: string
  content: string
  sender: string
  timestamp: number
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [autoReply, setAutoReply] = useState(false)

  useEffect(() => {
    // Subscribe to the chat channel
    const channel = pusher.subscribe('chat')
    
    channel.bind('message', (data: Message) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      pusher.unsubscribe('chat')
    }
  }, [])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const message = {
      id: Math.random().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: Date.now()
    }

    // Send message to your API endpoint that triggers Pusher
    await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    setInputMessage('')
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Left Sidebar */}
        <div className="w-16 border-r flex flex-col items-center py-4 gap-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <nav className="flex flex-col gap-4">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Home className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Tv className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Settings className="h-5 w-5" />
            </Button>
          </nav>
        </div>

        {/* Channel List */}
        <div className="w-64 border-r">
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button size="icon" variant="ghost">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="px-4 pb-4">
            <Input placeholder="Search messages" className="h-9" />
          </div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="px-2 space-y-2">
              <Button variant="secondary" className="w-full justify-start px-4 py-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold">Public Channel</div>
                    <div className="text-sm text-muted-foreground">Click to join</div>
                  </div>
                </div>
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b flex items-center justify-between px-4">
            <h2 className="font-semibold">Public Channel</h2>
            <Button variant="secondary" size="sm">
              <PhoneCall className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2 max-w-[70%]",
                    message.sender === 'user' ? "ml-auto" : ""
                  )}
                >
                  {message.sender !== 'user' && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-lg px-3 py-2",
                    message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Auto-Reply:</span>
              <Switch
                checked={autoReply}
                onCheckedChange={setAutoReply}
              />
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="w-64 border-l p-4">
          <h3 className="font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            {[
              { icon: <Edit className="h-4 w-4" />, title: "Channel Name", desc: "Change channel name" },
              { icon: <LinkIcon className="h-4 w-4" />, title: "Invite Link", desc: "Share invite link" },
              { icon: <Filter className="h-4 w-4" />, title: "Message Filtering", desc: "Filter messages" },
              { icon: <BarChart2 className="h-4 w-4" />, title: "Information Capture", desc: "Capture settings" },
              { icon: <RefreshCw className="h-4 w-4" />, title: "Third-Party Integrations", desc: "Connect apps" },
              { icon: <ClipboardList className="h-4 w-4" />, title: "Message Summary", desc: "View summary" },
              { icon: <Trash2 className="h-4 w-4" />, title: "Channel Deletion", desc: "Delete channel" },
            ].map((item) => (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.desc}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
