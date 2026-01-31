import { db } from "@/app/libs/db";

export const saveMediaIndb = async ({ id, title, type, path, status }) => {
    try {
        await db.downloads.put({
            id: id,          // unique
            fileName: title,
            type: type,
            localPath: path,
            status,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error saving media:', error);
    }
};