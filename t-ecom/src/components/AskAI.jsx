import { useEffect, useState, useCallback } from "react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";

import { apifetch } from "../utils/api";

function AskAi() {

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setMessages([
            {
                message: "Hello, I'm your personal AI!",
                sender: "AI",
                direction: "incoming"
            }
        ]);
    }, []);

    const processMessageToChatGPT = async (chatMessage) => {

        const response = await apifetch(
            `/api/chat/ask?message=${encodeURIComponent(chatMessage)}`,
            {
                method: "GET"
            }
        );

        if (!response.ok) {

            let errMsg =
                "Failed to get response from TeluskoBot";

            try {

                const errorData =
                    await response.json();

                errMsg =
                    errorData.error?.message ||
                    errorData.message ||
                    errMsg;

            } catch {

                try {
                    errMsg = await response.text();
                } catch {}

            }

            throw new Error(errMsg);
        }

        let botMessageText;

        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {

            const data = await response.json();

            botMessageText =
                typeof data === "string"
                    ? data
                    : (data.response ??
                       JSON.stringify(data));

        } else {

            botMessageText =
                await response.text();
        }

        setMessages(prev => [
            ...prev,
            {
                message: botMessageText,
                sender: "ChatGPT",
                direction: "incoming"
            }
        ]);
    };

    const handleSend = useCallback(
        async (messageText) => {

            const userMessage = {
                message: messageText,
                sender: "user",
                direction: "outgoing"
            };

            setMessages(prev => [
                ...prev,
                userMessage
            ]);

            setIsTyping(true);
            setError(null);

            try {

                await processMessageToChatGPT(
                    messageText
                );

            } catch (err) {

                setError(
                    err.message ||
                    "Something went wrong."
                );

            } finally {

                setIsTyping(false);

            }
        },
        []
    );

    return (

        <div className="container-fluid mt-5 pt-5">

            <div className="row justify-content-center">

                <div className="col-md-10 col-lg-8">

                    <div
                        className="card shadow"
                        style={{ height: "80vh" }}
                    >

                        <div className="card-header bg-primary text-white">

                            <h5 className="mb-0">

                                <i className="bi bi-robot me-2"></i>

                                AI Assistant

                            </h5>

                        </div>

                        <div
                            className="card-body p-0"
                            style={{
                                height:
                                    "calc(100% - 56px)"
                            }}
                        >

                            <MainContainer
                                style={{
                                    height: "100%"
                                }}
                            >

                                <ChatContainer
                                    style={{
                                        height: "100%"
                                    }}
                                >

                                    <MessageList
                                        scrollBehavior="smooth"
                                        typingIndicator={
                                            isTyping
                                                ? (
                                                    <TypingIndicator
                                                        content="AI is typing"
                                                    />
                                                )
                                                : null
                                        }
                                    >

                                        {messages.map(
                                            (m, i) => (

                                                <Message
                                                    key={i}
                                                    model={m}
                                                />

                                            )
                                        )}

                                    </MessageList>

                                    <MessageInput
                                        placeholder="Type your message here..."
                                        onSend={handleSend}
                                        attachButton={false}
                                        disabled={isTyping}
                                    />

                                </ChatContainer>

                            </MainContainer>

                        </div>

                        {error && (

                            <div
                                className="alert alert-danger m-3 mb-4"
                                role="alert"
                            >

                                <i className="bi bi-exclamation-triangle-fill me-2"></i>

                                {error}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AskAi;