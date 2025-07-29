export const pick = <T extends {}>(obj: T, keys: Array<keyof T>) => keys.map(k => obj[k])
export const pickOne = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
