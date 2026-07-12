const container = document.getElementById("songContainer");

fetch("https://module-5-song.onrender.com/songs")
    .then(response => response.json())
    .then(songs => {

        songs.forEach(song => {

            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow">
                        <div class="card-body">
                            <h4>${song.title}</h4>
                            <p>${song.artist}</p>
                        </div>
                    </div>
                </div>
            `;

        });

    })
    .catch(error => {
        console.log("Error loading songs:", error);
    });
