export function getRandomID() {
    const randomNumber = Math.random().toString(36).slice(2, 9);
    const timeStamp = new Date().getTime();

    return String(timeStamp) + randomNumber;
}
