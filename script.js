function copyScript() {
    let scriptBox = document.getElementById("scriptBox");
    scriptBox.select();
    document.execCommand("copy");

    let button = document.getElementById("copyScriptButton");
    button.textContent = "Copied!"; // Change button text

    // Reset text back to "Copy Script" after 2 seconds
    setTimeout(() => {
        button.textContent = "Copy Script";
    }, 2000);
}

async function pasteContent() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        let pastedContentDiv = document.getElementById("pastedContent");
        pastedContentDiv.textContent = clipboardText;
    } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
    }
}


// Function to display links with individual copy buttons
function displayLinksWithCopyButtons(links) {
    const pastedContentDiv = document.getElementById("pastedContent");
    pastedContentDiv.innerHTML = ''; // Clear any previous content

    links.forEach(link => {
        // Create a div to hold each link and its copy button
        const linkContainer = document.createElement('div');
        linkContainer.style.marginBottom = '10px';

        // Create the link element
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.target = "_blank"; // Open in a new tab
        linkElement.textContent = link;
        linkContainer.appendChild(linkElement);

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = "Copy Link";
        copyButton.style.marginLeft = '10px';
        copyButton.classList.add('copy-button');

        // Add click event to copy the link to clipboard
        copyButton.addEventListener('click', function () {
            navigator.clipboard.writeText(link);
            copyButton.textContent = "Copied!"; // Change button text

            // Reset text back to "Copy Link" after 2 seconds
            setTimeout(() => {
                copyButton.textContent = "Copy Link";
            }, 2000);
        });

        // Append link and copy button to the container
        linkContainer.appendChild(copyButton);
        pastedContentDiv.appendChild(linkContainer);
    });
}


// Function to handle pasted content from the clipboard
async function pasteContent() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        let videoLinks = clipboardText.split("\n");
        displayLinksWithCopyButtons(videoLinks);
    } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
    }
}

async function displayLinksWithCopyButtons(links) {
    const pastedContentDiv = document.getElementById("pastedContent");
    pastedContentDiv.innerHTML = ''; // Clear previous content

    for (const link of links) {
        // Fetch TikTok video details
        const thumbnailUrl = await fetchTikTokThumbnail(link);

        // Create a div to hold each link, thumbnail, and copy button
        const linkContainer = document.createElement('div');
        linkContainer.style.marginBottom = '15px';
        linkContainer.style.display = 'flex';
        linkContainer.style.alignItems = 'center';

        if (thumbnailUrl) {
            // Load the image, then resize it in a hidden canvas
            const thumbnail = document.createElement('img');
            thumbnail.src = thumbnailUrl;
            thumbnail.alt = "TikTok Thumbnail";
            thumbnail.style.width = '80px'; // Reduce display size
            thumbnail.style.height = 'auto';
            thumbnail.style.marginRight = '10px';
            thumbnail.style.cursor = 'pointer';

            // Clicking the thumbnail opens the video
            thumbnail.addEventListener('click', () => {
                window.open(link, "_blank");
            });

            // Reduce quality by processing image
            thumbnail.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set smaller canvas size (e.g., 50% of original)
                canvas.width = thumbnail.naturalWidth / 3;
                canvas.height = thumbnail.naturalHeight / 3;

                // Draw the image in lower quality
                ctx.drawImage(thumbnail, 0, 0, canvas.width, canvas.height);

                // Convert to lower-quality base64
                thumbnail.src = canvas.toDataURL('image/jpeg', 0.4); // 40% quality
            };

            linkContainer.appendChild(thumbnail);
        }

        // Create the link element
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.target = "_blank"; // Open in a new tab
        linkElement.textContent = link;
        linkElement.style.marginRight = '10px';

        // Create the copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = "Copy Link";
        copyButton.classList.add('copy-button');

        copyButton.addEventListener('click', function () {
            navigator.clipboard.writeText(link);
            copyButton.textContent = "Copied!";
            setTimeout(() => {
                copyButton.textContent = "Copy Link";
            }, 2000);
        });

        // Append elements to the container
        linkContainer.appendChild(linkElement);
        linkContainer.appendChild(copyButton);
        pastedContentDiv.appendChild(linkContainer);
    }
}

// Function to fetch TikTok thumbnail using oEmbed API
async function fetchTikTokThumbnail(url) {
    try {
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.thumbnail_url || null;
    } catch (error) {
        console.error("Error fetching TikTok thumbnail:", error);
        return null;
    }
}