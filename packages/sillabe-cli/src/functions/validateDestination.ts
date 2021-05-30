import { existsSync } from 'fs';

export const validateDestination = (absolutePath: string) => {
    if (existsSync(absolutePath)) {
        throw new Error(`Path ${absolutePath} already exists`);
    }
};
