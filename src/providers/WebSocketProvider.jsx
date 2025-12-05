/* eslint-disable react/prop-types */
import React from "react";
import { useChatStore } from "@/store/chat.store";

export default function WebSocketProvider({ children }) {
    const addMessage = useChatStore((s) => s.addMessage);
    const updateAck = useChatStore((s) => s.updateMessageAck);
    const updatePreview = useChatStore((s) => s.updateConversationPreview);

    const wsRef = React.useRef(null);

    React.useEffect(() => {

        const ws = new WebSocket(
            `ws://localhost:3001/ws?session=*&events=*`
        );
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("[WS] Connected to phone:");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log(JSON.stringify(data, null, 2))

            if (data.event === "message") {
                addMessage(data.payload);
                updatePreview(data.payload);
            }

            if (data.event === "message.ack") {
                if (data.payload.message) {
                    addMessage(data.payload.message);
                    updatePreview(data.payload.message);
                }

                updateAck(data.payload);
            }
        };

        ws.onclose = () => {
            console.log("[WS] Disconnected. Reconnecting in 1s...");
            setTimeout(() => {
                wsRef.current = null;
            }, 1000);
        };

        return () => ws.close();
    }, [addMessage, updateAck, updatePreview]);

    return <>{children}</>;
}
