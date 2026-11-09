"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Sparkles,
    MapPin,
    MessageCircle,
    Award
} from "lucide-react";
import { useContactSettings } from "@/context/ContactContext";

// Helper to convert standard YouTube / Vimeo links into embed links
function getEmbedUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
        return `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`;
    }

    return null;
}

export default function StoreVideoSection() {
    const { contactSettings } = useContactSettings();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [hasStartedPlaying, setHasStartedPlaying] = useState<boolean>(false);

    const rawVideoUrl = contactSettings.store_video_url || null;
    const embedUrl = getEmbedUrl(rawVideoUrl);
    const isDirectVideo = Boolean(rawVideoUrl && !embedUrl);

    // Fallback poster & video
    const fallbackPoster = "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1600&auto=format&fit=crop";
    const posterUrl = contactSettings.store_video_poster_url || fallbackPoster;
    const directVideoSrc = isDirectVideo ? rawVideoUrl : null;

    const title = contactSettings.store_video_title || "Experience Our Flagship Boutique";
    const description = contactSettings.store_video_description || "Step into the realm of rare essences and bespoke olfactory mastery in Abu Dhabi. Discover private consultation suites and centuries-old Middle Eastern perfumery traditions.";

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
            setHasStartedPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleFullScreen = () => {
        if (!videoRef.current) return;
        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <div className="w-full h-full bg-gradient-to-b from-[#1B1315] via-[#24171B] to-[#1B1315] text-[#FAFAF8] rounded-2xl border border-[#E9D7C3]/15 p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient luxury lighting */}
            <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-[#4A323A]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Header Section */}
                <div className="space-y-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-[9px] font-bold tracking-[0.25em] uppercase">
                        <Sparkles size={11} className="text-[#D4AF37]" />
                        <span>ATELIER & BOUTIQUE SHOWCASE</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F7F3F4] tracking-tight">
                        {title}
                    </h2>

                    <p className="text-xs text-[#E9D7C3]/80 leading-relaxed font-light line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Video Player Container */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_12px_35px_rgba(0,0,0,0.5)] bg-black group my-2">
                    {embedUrl ? (
                        /* Embedded Player (YouTube / Vimeo) */
                        <iframe
                            src={embedUrl}
                            title={title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : directVideoSrc ? (
                        /* Direct HTML5 Video Player */
                        <div className="relative w-full h-full">
                            <video
                                ref={videoRef}
                                src={directVideoSrc}
                                poster={posterUrl}
                                playsInline
                                muted={isMuted}
                                onEnded={() => setIsPlaying(false)}
                                className="w-full h-full object-cover"
                            />

                            {/* Center Play/Pause Overlay */}
                            {(!isPlaying || !hasStartedPlaying) && (
                                <div
                                    onClick={togglePlay}
                                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/30"
                                >
                                    <button
                                        type="button"
                                        aria-label="Play Store Video"
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] text-[#1B1315] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Play size={28} className="ml-1 fill-[#1B1315]" />
                                    </button>
                                </div>
                            )}

                            {/* Control Bar Overlay on Hover */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-2.5">
                                    <button
                                        onClick={togglePlay}
                                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                    >
                                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                        aria-label={isMuted ? "Unmute" : "Mute"}
                                    >
                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                    </button>
                                </div>

                                <button
                                    onClick={handleFullScreen}
                                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    aria-label="Fullscreen"
                                >
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Default Elegant Visual Showcase when no video has been uploaded yet */
                        <div className="relative w-full h-full flex flex-col justify-end p-5">
                            <Image
                                src={posterUrl}
                                alt="Flagship Boutique"
                                fill
                                priority
                                className="object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315] via-[#1B1315]/40 to-black/20" />

                            <div className="relative z-10 max-w-sm">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] font-bold uppercase tracking-wider mb-1.5">
                                    <Award size={11} />
                                    Private Concierge Suites
                                </div>
                                <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                                    Musaffah M/9 Atelier • Abu Dhabi
                                </h3>
                                <p className="text-[11px] text-[#E9D7C3]/80 font-light mt-1">
                                    Custom bottle engraving & fragrance extract consultations.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                    {contactSettings.google_maps_link && (
                        <a
                            href={contactSettings.google_maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] text-[#1B1315] font-bold text-[11px] uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                        >
                            <MapPin size={14} />
                            <span>Get Directions</span>
                        </a>
                    )}

                    {contactSettings.whatsapp && (
                        <a
                            href={`https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Premium Essence, I would like to schedule a private boutique consultation.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/30 text-[#E9D7C3] font-bold text-[11px] uppercase tracking-wider hover:text-white transition-all backdrop-blur-sm"
                        >
                            <MessageCircle size={14} className="text-[#25D366]" />
                            <span>WhatsApp Concierge</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
