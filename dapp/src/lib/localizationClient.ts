import { createLocalizationClient } from "localization-sui-sdk";

export const localizationClient = createLocalizationClient({
  apiId: process.env.NEXT_PUBLIC_LOCALIZATION_API_ID!,
  apiKey: process.env.NEXT_PUBLIC_LOCALIZATION_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LOCALIZATION_API_URL!,
});
