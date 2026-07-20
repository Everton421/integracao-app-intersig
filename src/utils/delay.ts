 

export const delay = (ms: number,message?:string): Promise<void> => {
   return new Promise((resolve) => {
        console.log( message)
        setTimeout(resolve, ms)
    });
};