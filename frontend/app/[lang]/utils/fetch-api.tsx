import qs from "qs";
import { getStrapiURL } from "./api-helpers";

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  try {
    // Merge default and user options
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(
      `/api${path}${queryString ? `?${queryString}` : ""}`
    )}`;
    console.log("requestUrl", requestUrl);
    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);
    console.log("response", response);
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Please check if your server is running and you set all the required tokens.`
    );
  }
}
