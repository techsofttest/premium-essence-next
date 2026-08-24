"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface ContactSettingsData {
    company_name: string;
    address: string;
    phone: string;
    telephone?: string | null;
    whatsapp: string;
    email: string;
    support_email: string;
    working_hours: string;
    google_maps_link: string;
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    linkedin_url?: string | null;
    youtube_url?: string | null;
    tiktok_url?: string | null;
    pinterest_url?: string | null;
    social_links?: {
        facebook?: string | null;
        instagram?: string | null;
        twitter?: string | null;
        linkedin?: string | null;
        youtube?: string | null;
        tiktok?: string | null;
        pinterest?: string | null;
    };
}

const DEFAULT_CONTACT_SETTINGS: ContactSettingsData = {
    company_name: "Premium Essence Perfumes LLC",
    address: "Musaffah M/9, Abu Dhabi, United Arab Emirates",
    phone: "+971 55 723 2010",
    telephone: "02 550 8990",
    whatsapp: "+971 50 123 4567",
    email: "info@premiumessence.ae",
    support_email: "support@premiumessence.ae",
    working_hours: "Mon - Sat: 9:00 AM - 9:00 PM (GST)",
    google_maps_link: "https://maps.google.com/?q=Musaffah+M9+Abu+Dhabi+UAE",
    facebook_url: "https://facebook.com",
    instagram_url: "https://instagram.com",
    twitter_url: "https://twitter.com",
    linkedin_url: "https://linkedin.com",
    youtube_url: "https://youtube.com",
    tiktok_url: "https://tiktok.com",
    pinterest_url: "https://pinterest.com",
};

interface ContactContextType {
    contactSettings: ContactSettingsData;
    loading: boolean;
}

const ContactContext = createContext<ContactContextType>({
    contactSettings: DEFAULT_CONTACT_SETTINGS,
    loading: false,
});

export function ContactProvider({ children }: { children: React.ReactNode }) {
    const [contactSettings, setContactSettings] = useState<ContactSettingsData>(DEFAULT_CONTACT_SETTINGS);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api<ContactSettingsData>("/storefront/contact-settings")
            .then((data) => {
                if (data && data.company_name) {
                    setContactSettings(data);
                }
            })
            .catch(() => undefined)
            .finally(() => setLoading(false));
    }, []);

    return (
        <ContactContext.Provider value={{ contactSettings, loading }}>
            {children}
        </ContactContext.Provider>
    );
}

export function useContactSettings() {
    return useContext(ContactContext);
}
