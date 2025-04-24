import type { ZodSchema } from "zod";

const API_URL = import.meta.env.VITE_API_URL;

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
  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    });

    return await processApiResponse(response, schema);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

type PostToApiParams<T, B = unknown> = {
  endpoint: string;
  schema: ZodSchema<T>;
  body: B;
  params?: Record<string, string | number | boolean | undefined>;
};

export const postToApi = async <T, B = unknown>({
  endpoint,
  schema,
  body,
  params = {},
}: PostToApiParams<T, B>): Promise<T> => {
  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    return await processApiResponse(response, schema);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

type DeleteFromApiParams<T> = {
  endpoint: string;
  schema: ZodSchema<T>;
  params?: Record<string, string | number | boolean | undefined>;
};

export const deleteFromApi = async <T>({
  endpoint,
  schema,
  params = {},
}: DeleteFromApiParams<T>): Promise<T> => {
  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
    });

    return await processApiResponse(response, schema);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

const getAuthHeader = () => {
  const username = import.meta.env.VITE_API_USERNAME;
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!username || !apiKey) {
    console.error("API credentials not found. Please check your .env file.");
    return "";
  }

  return `Basic ${btoa(`${username}:${apiKey}`)}`;
};

const buildUrl = (
  endpoint: string,
  params: Record<string, string | number | boolean | undefined>,
) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return `${API_URL}/${endpoint}${queryParams ? `?${queryParams}` : ""}`;
};

const processApiResponse = async <T>(
  response: Response,
  schema: ZodSchema<T>,
): Promise<T> => {
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
};
