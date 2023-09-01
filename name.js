// Sample YouTube URL
const youtubeUrl = "https://www.youtube.com/c/CustomChannelURL";

// Regular expression to match the custom channel name
const regex = /\/c\/([a-zA-Z0-9_-]+)/;

// Use the regular expression to extract the custom channel name
const match = youtubeUrl.match(regex);

// Check if a match was found
if (match && match.length > 1) {
  const customChannelName = match[1];
  console.log("Custom Channel Name:", customChannelName);
} else {
  console.log("Custom channel name not found in the URL.");
}
