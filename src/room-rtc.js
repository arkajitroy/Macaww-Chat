// Agora-api-key
const APP_ID = "a665b755ada047408dc1e52d15fa84b0";

// everyone should have one user-id
// if someone does have, it will generate a random id
let uid = sessionStorage.getItem("uid");
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", uid);
}

let token = null;
let client;

// now we will create custom rooms based on the url
// so we can generate as many rooms as we want

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let room_id = urlParams.get("room");

// if we don't have room id - we will call it main
if (!room_id) {
  room_id = "main";
}

// audio and video tracks set up
let localTracks = [];
let remoteUsers = {};
// Screen Sharing
let localScreenTracks;
let sharingScreen = false;

// Room Joinings
let joinRoomInit = async () => {
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await client.join(APP_ID, room_id, token, uid);

  client.on("user-published", handleUserPublish);
  client.on("user-left", handleUserLeft);

  joinStream();
};

joinRoomInit();

// Initializing the camera for the stream
let joinStream = async () => {
  // it will ask you to give the permission of audio and video
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
    {},
    {
      encoderConfig: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
    }
  );
  let player = `<div class="video-container" id="user-container-${uid}">
                    <div class= 'video-player' id= "user-${uid}"></div>
                </div>`;

  document
    .getElementById("stream-container")
    .insertAdjacentHTML("beforeend", player);

  document
    .getElementById(`user-container-${uid}`)
    .addEventListener("click", expandVideoFrame);

  localTracks[1].play(`user-${uid}`);

  // localTrack[0] - audio      localTrack[1] - video
  await client.publish([localTracks[0], localTracks[1]]);
};

// publish the track
let handleUserPublish = async (user, mediaType) => {
  remoteUsers[user.uid] = user;

  await client.subscribe(user, mediaType);

  let player = document.getElementById(`user-container-${user.uid}`);

  if (player === null) {
    player = `  <div class="video-container" id="user-container-${user.uid}">
                    <div class= 'video-player' id= "user-${user.uid}"></div>
                </div>`;

    document
      .getElementById("stream-container")
      .insertAdjacentHTML("beforeend", player);

    document
      .getElementById(`user-container-${user.uid}`)
      .addEventListener("click", expandVideoFrame);
  }

  if (displayFrame.style.display) {
    player.style.height = "100px";
    player.style.width = "100px";
  }

  //check media type
  if (mediaType === "video") {
    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

// user leaves
let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();

  if (userIdDisplayFrame === `user-container-${user.uid}`) {
    displayFrame.style.display = null;
    let videoFrames = document.getElementsByClassName("video-container");

    for (let i = 0; videoFrames.length > i; i++) {
      videoFrames[i].style.height = "15rem";
      videoFrames[i].style.width = "20rem";
    }
  }
};

// Control Panel

// Mic Button Configuration
let toggleMic = async (e) => {
  let button = e.currentTarget;

  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    button.classList.add("active");
  } else {
    await localTracks[0].setMuted(true);
    button.classList.remove("active");
  }
};

// Camera Button Configuration
let toggleCamera = async (e) => {
  let button = e.currentTarget;

  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    button.classList.add("active");
  } else {
    await localTracks[1].setMuted(true);
    button.classList.remove("active");
  }
};

// Screen-Sharing Configuration
let toggleScreen = async (e) => {
  console.log("Screen Has been shared");
};

document.getElementById("mic-btn").addEventListener("click", toggleMic);
document.getElementById("camera-btn").addEventListener("click", toggleCamera);
document
  .getElementById("screen-share-btn")
  .addEventListener("click", toggleScreen);
