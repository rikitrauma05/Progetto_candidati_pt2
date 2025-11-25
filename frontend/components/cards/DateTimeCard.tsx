import { useEffect, useState } from "react";

export default function DateTimeCard() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();

            // Ora live
            setTime(
                now.toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );

            // Data con giorno
            setDate(
                now.toLocaleDateString("it-IT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            );
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex flex-col items-center text-center animate-fadeIn">
            <h3 className="text-xl font-semibold capitalize">{date}</h3>
            <p className="text-3xl font-bold mt-2">{time}</p>
        </div>
    );
}