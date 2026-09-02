import { delay } from "./delay.ts";

export async function retryAsync<T>( fn: () => Promise<T>, maxAttempts: number = 3, intervalMs: number = 3000 ): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`[retry] Tentativa ${attempt}/${maxAttempts} falhou: ${error}`);
      if (attempt < maxAttempts) {
        await delay(intervalMs);
      }
    }
  }
  throw lastError;
}
