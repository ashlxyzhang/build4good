let mediaRecorder;
let audioChunks = [];

document.getElementById("startRecord").onclick = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            submitAudio(audioBlob);
            audioChunks = [];
        };

        document.getElementById("stopRecord").disabled = false;
    });
};

document.getElementById("stopRecord").onclick = () => {
    mediaRecorder.stop();
    document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
};

function submitAudio(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    fetch("/identify_song", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success" && data.result) {
                // "12" Vinyl Record" (https://skfb.ly/6USuP) by AleixoAlonso is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
                //             const songDetails = `
                //             <div class="wrapper">
                //   <div class="product-img">
                //     <img src="${data.result.album_image_url}" height="300" width="300" />
                //   </div>
                //   <div class="product-info">
                //     <div class="product-text">
                //       <h1>${data.result.album}</h1>
                //       <h2>by ${data.result.artist}</h2>
                //       <p>
                //         Song title: ${data.result.title}
                //       </p>
                //     </div>
                //     <div class="product-price-btn">
                //       <a href="${data.result.song_link}" target="_blank">
                //         <button type="button">Listen on Music Platform</button>
                //     </div>
                //     </div>
                //   </div>
                // </div>`;
                const songDetails = `
  <img src="${data.result.album_image_url}" alt="Album Cover" class="album-cover">
  <div class="song-title">${data.result.title}</div>
  <div class="artist">${data.result.artist}</div>
  <div class="album-name">${data.result.album}</div>
  <a href="${data.result.song_link}" target="_blank" class="play-link">Listen on Music Platform</a>
`;

                document.getElementById("songInfo").innerHTML = songDetails;
            } else {
                document.getElementById("songInfo").innerText =
                    "Could not identify the song. Please try again.";
            }
        })
        .catch((error) => console.error("Error:", error));
}