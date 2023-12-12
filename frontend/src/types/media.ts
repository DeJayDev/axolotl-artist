type Media = {
    id: string,
    prompt: string,
    size: number,
    url?: string,
    state: "IN_QUEUE" | "IN_PROGRESS" | "FAILED" | "COMPLETED"
}

export type { Media } 
