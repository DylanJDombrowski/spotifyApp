const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { access } = require("fs");
const { get } = require("http");
const { URLSearchParams } = require("url");
const Buffer = require("buffer").Buffer;

// Your client ID and client secret
const client_id = "fd8ba7551b1242f088d325a8c7d95b78";
const client_secret = "65be1ec6ab8f459e9f57448be53e3273";

// Spotify's token endpoint
const token_url = "https://accounts.spotify.com/api/token";

// Function to request an access token
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const response = await fetch(token_url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();

  if (response.ok) {
    console.log("Access Token:", data.access_token);
    return data.access_token; // Return the access token
  } else {
    console.error("Failed to retrieve access token:", data);
    return null; // Return null in case of failure
  }
}

getAccessToken();

async function getTrack(trackId, accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // Use the passed access token
    },
  });

  const trackData = await response.json();

  if (response.ok) {
    console.log("Track Data:", trackData);
  } else {
    console.error("Failed to retrieve track data:", trackData);
  }
}

async function getProfile(accessToken) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Profile Data:", data);
    return data; // Return the user profile data
  } else {
    const errorData = await response.json();
    console.error("Failed to retrieve profile data:", errorData);
    return null; // Return null in case of failure
  }
}

// Main function to orchestrate getting the access token and fetching track data
async function main() {
  const accessToken = await getAccessToken();
  if (accessToken) {
    await getTrack("11dFghVXANMlKmJXsNCbNl", accessToken);

    // Fetch and log profile data
    const profileData = await getProfile(accessToken);
    console.log("Fetched Profile Data:", profileData);
  }
}

main();
