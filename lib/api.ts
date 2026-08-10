const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");

export class ApiError extends Error {
    constructor(message: string, public status: number, public errors?: Record<string, string[]>) {
        super(message);
    }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        credentials: "include",
        headers: {
            Accept: "application/json",
            ...(init.body ? { "Content-Type": "application/json" } : {}),
            ...init.headers,
        },
        ...init,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
        const firstValidationError = body.errors
            ? Object.values(body.errors).flat().find((message): message is string => typeof message === "string")
            : undefined;
        throw new ApiError(firstValidationError || body.message || body.error || "Request failed.", response.status, body.errors);
    }
    return body as T;
}
