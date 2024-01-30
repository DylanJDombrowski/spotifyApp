const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { URLSearchParams } = require("url");
const { Buffer } = require("buffer");

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
    throw new Error("Failed to retrieve access token"); // Throw an error to stop execution
  }
}

async function getArtist(artistId, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Use the passed access token
      },
    }
  );

  const artistData = await response.json();

  if (response.ok) {
    console.log("Artist Data:", artistData);
    return artistData; // Return the artist data
  } else {
    console.error("Failed to retrieve artist data:", artistData);
    throw new Error("Failed to retrieve artist data"); // Throw an error to stop execution
  }
}

async function getProfile(accessToken) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Profile Data:", data);
    return data; // Return the profile data
  } else {
    const errorData = await response.json();
    console.error("Failed to retrieve profile data:", errorData);
    throw new Error("Failed to retrieve profile data"); // Throw an error to stop execution
  }
}

// Main function to orchestrate the API calls
async function main() {
  try {
    const accessToken = await getAccessToken();

    // Example artistId - Replace with a valid artistId
    const artistId = "4Z8W4fKeB5YxbusRsdQVPb";

    const artistData = await getArtist(artistId, accessToken);
    console.log("Fetched Artist Data:", artistData);

    const profileData = await getProfile(accessToken);
    console.log("Fetched Profile Data:", profileData);
  } catch (error) {
    console.error("Error in main execution:", error.message);
  }
}

main();
