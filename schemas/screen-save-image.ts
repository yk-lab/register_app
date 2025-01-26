import { z } from "zod";

export const screenSaveImageSchema = z.object({
	url: z.string().url(),
});

export type ScreenSaveImage = z.infer<typeof screenSaveImageSchema>;
