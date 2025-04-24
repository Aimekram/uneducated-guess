import type { ZodSchema } from "zod";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const username = import.meta.env.VITE_API_USERNAME;
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!username || !apiKey) {
    console.error("API credentials not found. Please check your .env file.");
    return "";
  }

  return `Basic ${btoa(`${username}:${apiKey}`)}`;
};

type GetFromApiParams<T> = {
  endpoint: string;
  schema: ZodSchema<T>;
  params?: Record<string, string | number | boolean | undefined>;
};

export const getFromApi = async <T>({
  endpoint,
  schema,
  params = {},
}: GetFromApiParams<T>): Promise<T> => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  const url = `${API_URL}/${endpoint}${queryParams ? `?${queryParams}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const rawData = (await response.json()) as unknown;

    try {
      return await schema.parseAsync(rawData);
    } catch (error) {
      console.error("Data validation error:", error);
      throw new Error("Failed to validate API response");
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
