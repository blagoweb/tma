export const errorLog = (e: unknown, message: string = '') => {
    console.error(e instanceof Error ? e : new Error(String(e)), message)
}