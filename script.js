console.log("lets write js");
let currentsong = new Audio();
function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "invalid";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  // Pad single digits with leading zero
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5503/songs/");
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as)
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playmusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
  }

  play.src = "pause.svg";
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00";
};

// got the list of all songs
async function main() {
  let songs = await getsongs();
  playmusic(songs[0], true);
  console.log(songs);
  //  .we got alll the songs from here
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                            <div class="music-player">
                                <img class="invert-songlist " src="music.svg" alt="Music Icon">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div>Spotify</div>
                                </div>
                                <div class="playnow">
                                    <img src="playbutton.svg" alt="Play Button">
                                    <span>Play Now</span>
                                </div>
                            </div> </li>`;
  }
  // attach event listener
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  //attach event listenenr to prev play next
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });
  // listen for time update
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutes(
      currentsong.currentTime
    )}/${secondsToMinutes(currentsong.duration)}`;
  });

  //music duration
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });
  currentsong.addEventListener("timeupdate", () => {
    let percent = (currentsong.currentTime / currentsong.duration) * 100;
    document.querySelector(".circle").style.left = percent + "%";
  });
}

main();
