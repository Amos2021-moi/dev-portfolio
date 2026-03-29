import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const MARK_CONTEXT = `
You are an AI assistant for Mark Amos Osiemo's developer portfolio website.

About Mark:
- Full name: Mark Amos Osiemo
- Role: Computer Science student at South Eastern Kenya University (SEKU)
- Location: Kenya, East Africa
- Email: amosmark2332@gmail.com
- GitHub: github.com/AMOS2021-MOI

Mark's Skills:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Next.js API Routes, REST APIs
- Database: PostgreSQL, Prisma ORM, Redis, MongoDB
- DevOps: Docker, GitHub Actions, Vercel, CI/CD, Linux
- Languages: TypeScript, JavaScript, Python, SQL, Bash
- Tools: Git, VS Code, Postman, Figma, GitHub

Mark's Projects:
1. Dev Portfolio Platform - Full-stack portfolio with AI assistant, built with Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS
2. AI Chat Application - Real-time chat app with Socket.io, React, Node.js, MongoDB
3. E-Commerce Dashboard - Admin dashboard with Stripe integration, Next.js, PostgreSQL, Redis
4. Task Management App - Collaborative task manager with React, TypeScript, Node.js, Socket.io
5. Weather Dashboard - Weather app with React, TypeScript, OpenWeather API
6. URL Shortener - URL shortening service with Next.js, PostgreSQL, Redis

Availability:
- Available for freelance work and open to full-time opportunities
- Responds to emails within 24 hours
- Contact: amosmark2332@gmail.com

Instructions:
- Be friendly, helpful, and professional
- Answer questions about Mark's skills, projects, experience, and availability
- Keep responses concise and conversational
- If asked something not covered above, suggest contacting Mark directly
- Never make up information about Mark
- Respond in the same language the visitor uses
`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    const { type, messages, prompt, context } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.0-flash-lite" },
      { apiVersion: "v1" }
    );

    // Feature 1 — AI Chat Assistant
    if (type === "chat") {
      if (!messages || messages.length === 0) {
        return NextResponse.json({ error: "Messages required" }, { status: 400 });
      }

      const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: MARK_CONTEXT }] },
          { role: "model", parts: [{ text: "Understood. I am Mark's AI assistant and I am ready to help visitors learn about his skills, projects, and experience." }] },
          ...history,
        ],
      });

      const lastMessage = messages[messages.length - 1].content;
      const result = await chat.sendMessage(lastMessage);
      const response = await result.response;
      return NextResponse.json({ response: response.text() });
    }

    // Feature 2 — AI Project Summary Generator
    if (type === "project_summary") {
      if (!prompt) {
        return NextResponse.json({ error: "Prompt required" }, { status: 400 });
      }

      const promptText = `
        You are a professional developer portfolio writer.
        Write a compelling project description for this project:
        Title: ${prompt}
        ${context ? "Additional context: " + context : ""}
        
        Requirements:
        - Write 2-3 sentences maximum
        - Be specific about what the project does
        - Mention the key benefit or problem it solves
        - Sound professional but not overly formal
        - Do not use bullet points
        - Write only the description, nothing else
      `;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      return NextResponse.json({ response: response.text() });
    }

    // Feature 3 — AI Blog Post Writer
    if (type === "blog_draft") {
      if (!prompt) {
        return NextResponse.json({ error: "Prompt required" }, { status: 400 });
      }

      const promptText = `
        You are a professional technical blog writer specializing in web development.
        Write a complete blog post about: ${prompt}
        
        Requirements:
        - Write in markdown format
        - Include an introduction paragraph
        - Include 3-4 main sections with ## headings
        - Each section should have 2-3 paragraphs
        - End with a conclusion section
        - Write from the perspective of a CS student who is learning and building
        - Keep the tone conversational but informative
        - Total length: 400-600 words
        - Do not include the title at the top
        - Write only the blog post content, nothing else
      `;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      return NextResponse.json({ response: response.text() });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error: unknown) {
    const err = error as { message?: string };

    if (err.message?.includes("429")) {
      return NextResponse.json(
        { error: "The AI is taking a short break. Please try again in 1 minute." },
        { status: 429 }
      );
    }

    console.error("AI ERROR:", err.message);
    return NextResponse.json({ error: err.message || "AI request failed" }, { status: 500 });
  }
}