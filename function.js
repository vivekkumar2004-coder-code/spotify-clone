console.log("lets write js");
let currentsong = new Audio();

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs() {
    try {
        let response = await fetch("http://127.0.0.1:5502/songs/");
        let html = await response.text();

        let div = document.createElement("div");
        div.innerHTML = html;

        let songs = Array.from(div.getElementsByTagName("a"))
            .filter(link => link.href.endsWith(".mp3"))
            .map(link => decodeURI(link.href.split("/songs/")[1]));

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/songs/${track}`;
    if (!pause) currentsong.play();

    play.src = "pause.svg";
    document.querySelector(".songinfo").textContent = track;
    document.querySelector(".songtime").textContent = "00:00";
};

async function main() {
    let songs = await getsongs();
    playmusic(songs[0], true);

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = songs.map(song => `
        <li>
            <div class="music-player">
                <img class="invert-songlist" src="music.svg" alt="Music Icon">
                <div class="info">
                    <div>${song.replace("%20", " ")}</div>
                    <div>Spotify</div>
                </div>
                <div class="playnow">
                    <img src="playbutton.svg" alt="Play Button">
                    <span>Play Now</span>
                </div>
            </div>
        </li>`).join("");

    Array.from(songUL.getElementsByTagName("li")).forEach(item => {
        item.addEventListener("click", () => {
            let songTitle = item.querySelector(".info div").textContent.trim();
            playmusic(songTitle);
        });
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        const currentTime = secondsToMinutes(currentsong.currentTime);
        const duration = isNaN(currentsong.duration) ? "00:00" : secondsToMinutes(currentsong.duration);

        document.querySelector(".songtime").textContent = `${currentTime} / ${duration}`;
    });
}

main();

