"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import Link from "next/link";
import { profile } from "@/app/_data/site";

type Message = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  links?: { label: string; href: string }[];
};

const STARTER_PROMPTS = [
  "What is Adesh's core stack?",
  "Tell me about SalesAstra architecture",
  "What AWS services has he owned?",
  "How can I get in touch?",
];

function generateResponse(query: string): { text: string; links?: { label: string; href: string }[] } {
  const q = query.toLowerCase();

  if (q.includes("stack") || q.includes("technology") || q.includes("tools") || q.includes("languages")) {
    return {
      text: "Adesh's primary stack centers around TypeScript, NestJS (microservices), Next.js, and AWS.\n\n• Backend: NestJS, Node.js, Express.js, WebSockets, REST APIs\n• Cloud (AWS): Kinesis, Lambda, SQS, ECS, Cognito, OpenSearch, ElastiCache, S3, API Gateway\n• Database & Cache: MongoDB, Redis (version-based caching)\n• DevOps & Infra: Terraform (IaC), GitHub Actions, Docker",
      links: [
        { label: "View Technical Stack", href: "/technology" },
        { label: "View Experience", href: "/experience" },
      ],
    };
  }

  if (q.includes("salesastra") || q.includes("crm") || q.includes("messaging") || q.includes("architecture") || q.includes("kinesis")) {
    return {
      text: "At Miraki Technologies, Adesh is a core engineer on SalesAstra — an AI-powered, multi-tenant CRM platform.\n\nKey architectural ownership includes:\n1. Omni-Channel Ingestion: Unified WhatsApp, Instagram, Messenger & Web Chatbot via AWS Lambda + Kinesis with guaranteed per-tenant conversation ordering.\n2. Graph-based RBAC: Multi-tenant scope resolution (All/Team/Own) enforced across all microservices.\n3. AI-Assisted Workflows: Dynamic AI ↔ human handoff, round-robin agent assignment, and automated lead capture.",
      links: [
        { label: "Read Case Studies", href: "/work" },
        { label: "Kinesis vs SQS Deep Dive", href: "/blog/kinesis-vs-sqs-messaging-pipeline" },
      ],
    };
  }

  if (q.includes("aws") || q.includes("cloud") || q.includes("infrastructure") || q.includes("terraform")) {
    return {
      text: "Adesh owns 6+ core AWS services end-to-end:\n• Kinesis & SQS for event streaming and async queues\n• Lambda for serverless webhook ingestion and payload normalisation\n• Cognito for multi-tenant auth and impersonation tokens\n• OpenSearch for serverless global search with RBAC scope filtering\n• ElastiCache (Redis) with version-based invalidation\n• ECS, API Gateway, S3, and CloudWatch — all provisioned with Terraform.",
      links: [
        { label: "Explore Technology Stack", href: "/technology" },
        { label: "Read Work Case Studies", href: "/work" },
      ],
    };
  }

  if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("whatsapp")) {
    return {
      text: `You can reach Adesh directly:\n• Email: ${profile.email}\n• WhatsApp / Phone: ${profile.phone}\n• Location: ${profile.location}\n\nHe is open to engineering roles, platform/architecture work, and distributed systems discussions.`,
      links: [
        { label: "Go to Contact Page", href: "/contact" },
        { label: "Open WhatsApp", href: "https://wa.me/message/WBX66Q3PYHI6N1" },
      ],
    };
  }

  if (q.includes("experience") || q.includes("background") || q.includes("education") || q.includes("cbit") || q.includes("role")) {
    return {
      text: `Adesh is currently an Associate Full-Stack Engineer (Distributed Systems & AWS) at Miraki Technologies (since Feb 2025, transitioned full-time in Aug 2025).\n\n• Education: B.E. in Computer Science from Chaitanya Bharathi Institute of Technology (CGPA 9.3/10.0, Graduated June 2025).\n• Track Record: 50+ production features shipped, 4 messaging channels integrated, and full multi-tenant architecture ownership.`,
      links: [
        { label: "View Experience", href: "/experience" },
        { label: "Read About Adesh", href: "/about" },
      ],
    };
  }

  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who are you")) {
    return {
      text: `Hi there! I'm Adesh's portfolio assistant. I can answer questions about his systems engineering work, AWS architecture, SalesAstra CRM platform, technical stack, or how to get in touch with him.`,
      links: [
        { label: "Selected Work", href: "/work" },
        { label: "Contact Info", href: "/contact" },
      ],
    };
  }

  // Fallback
  return {
    text: `Adesh is a Full-Stack Engineer specializing in distributed systems, event-driven architectures, and AWS infrastructure (NestJS, Next.js, Kinesis, Terraform, MongoDB, Redis).\n\nFeel free to ask about his work on SalesAstra, his technical stack, or his background!`,
    links: [
      { label: "View Work", href: "/work" },
      { label: "Get in Touch", href: "/contact" },
    ],
  };
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hi! I'm Adesh's portfolio assistant. Ask me anything about his systems, SalesAstra architecture, tech stack, or background.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Position state (null indicates default bottom-right docked position)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  const widgetRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Keep widget inside viewport on window resize if dragged
  useEffect(() => {
    const handleResize = () => {
      if (!widgetRef.current || !position) return;
      const width = widgetRef.current.offsetWidth || 380;
      const height = widgetRef.current.offsetHeight || 500;
      const maxX = Math.max(12, window.innerWidth - width - 16);
      const maxY = Math.max(12, window.innerHeight - height - 16);
      setPosition((prev) => {
        if (!prev) return null;
        return {
          x: Math.min(Math.max(12, prev.x), maxX),
          y: Math.min(Math.max(12, prev.y), maxY),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position]);

  // Pointer drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    const widget = widgetRef.current;
    if (!widget) return;

    const rect = widget.getBoundingClientRect();
    const currentX = position ? position.x : rect.left;
    const currentY = position ? position.y : rect.top;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: currentX,
      posY: currentY,
    };
    setIsDragging(true);
    setPosition({ x: currentX, y: currentY });
  }, [position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const width = widgetRef.current?.offsetWidth || 380;
    const height = widgetRef.current?.offsetHeight || 500;
    const maxX = Math.max(12, window.innerWidth - width - 16);
    const maxY = Math.max(12, window.innerHeight - height - 16);

    const nextX = Math.min(Math.max(12, dragStartRef.current.posX + deltaX), maxX);
    const nextY = Math.min(Math.max(12, dragStartRef.current.posY + deltaY), maxY);

    setPosition({ x: nextX, y: nextY });
  }, [isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDragging(false);
  }, [isDragging]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(query);
      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links: response.links,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 380);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ----------------- Floating Launcher Button ----------------- */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isOpen
          ? "pointer-events-none scale-75 opacity-0 translate-y-4"
          : "scale-100 opacity-100 translate-y-0"
          }`}
      >
        <button
          onClick={handleOpen}
          className="group flex items-center gap-3 rounded-full border border-hairline-strong bg-surface/95 px-4 py-3 text-paper shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-signal hover:bg-surface"
          aria-label="Open chat assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-paper transition-colors group-hover:text-signal">
            Ask Assistant
          </span>
          <svg
            className="h-4 w-4 text-slate transition-colors group-hover:text-signal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>

      {/* ----------------- Chat Window Container ----------------- */}
      <div
        ref={widgetRef}
        style={
          position
            ? {
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              top: 0,
              left: 0,
              bottom: "auto",
              right: "auto",
            }
            : undefined
        }
        className={`fixed z-50 w-[calc(100vw-32px)] max-w-[380px] select-none rounded-2xl border border-hairline-strong bg-surface/95 shadow-2xl backdrop-blur-xl transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${!position ? "bottom-6 right-6" : ""
          } ${isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "pointer-events-none scale-90 opacity-0 translate-y-6"
          } ${isDragging ? "shadow-signal/15 ring-1 ring-signal/40 cursor-grabbing" : ""}`}
      >
        {/* ----------------- Header (Drag Handle) ----------------- */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex cursor-grab items-center justify-between border-b border-hairline px-4 py-3 active:cursor-grabbing"
        >
          <div className="flex items-center gap-2.5">
            {/* Drag grip icon */}
            <span className="text-slate/60 hover:text-slate transition-colors" title="Drag anywhere to reposition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="8" cy="6" r="1.5" />
                <circle cx="16" cy="6" r="1.5" />
                <circle cx="8" cy="12" r="1.5" />
                <circle cx="16" cy="12" r="1.5" />
                <circle cx="8" cy="18" r="1.5" />
                <circle cx="16" cy="18" r="1.5" />
              </svg>
            </span>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal" />
              <div>
                <p className="text-xs font-semibold tracking-tight text-paper">
                  Adesh Assistant
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate">
                  Systems & Architecture
                </p>
              </div>
            </div>
          </div>

          {/* Window actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="rounded-lg p-1.5 text-slate transition-colors hover:bg-surface-2 hover:text-paper"
              title={isMinimized ? "Expand" : "Minimize"}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              {isMinimized ? (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </button>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-slate transition-colors hover:bg-surface-2 hover:text-paper"
              title="Close"
              aria-label="Close chat"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ----------------- Body (Chat area) ----------------- */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${isMinimized
            ? "max-h-0 opacity-0 pointer-events-none"
            : "max-h-[calc(100vh-140px)] h-[460px] opacity-100"
            }`}
        >
          {/* Message stream */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${msg.sender === "user"
                    ? "bg-signal text-base font-medium"
                    : "border border-hairline bg-base text-mist"
                    }`}
                >
                  <p className="whitespace-pre-line text-[13px]">{msg.text}</p>
                </div>

                {/* Quick Navigation Links if provided */}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        className="inline-flex items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-signal transition-colors hover:border-signal hover:bg-surface"
                      >
                        <span>{link.label}</span>
                        <span aria-hidden>→</span>
                      </Link>
                    ))}
                  </div>
                )}

                <span className="mt-1 font-mono text-[9px] text-slate/70">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-xl border border-hairline bg-base px-3 py-2 text-xs text-slate w-fit">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-signal [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions when history is short */}
          {messages.length <= 2 && (
            <div className="flex-shrink-0 border-t border-hairline/60 bg-base/40 px-3 py-2">
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-slate">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="rounded-full border border-hairline bg-surface px-2.5 py-1 text-left text-[11px] text-mist transition-colors hover:border-signal/50 hover:text-paper"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- Input form ----------------- */}
          <form
            onSubmit={handleSubmit}
            className="flex-shrink-0 flex items-center gap-2 border-t border-hairline bg-surface-2/80 p-3 rounded-b-2xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about systems, stack, projects..."
              className="flex-1 rounded-xl border border-hairline bg-base px-3 py-2 text-xs text-paper placeholder-slate/70 outline-none transition-colors focus:border-signal"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal text-base font-medium transition-opacity disabled:opacity-30"
              aria-label="Send message"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
