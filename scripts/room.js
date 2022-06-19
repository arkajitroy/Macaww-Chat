let messagesContainer = document.getElementById("messages");
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById("members__container");
const memberButton = document.getElementById("members__button");

const chatContainer = document.getElementById("messages__container");
const chatButton = document.getElementById("chat__button");

let activeMemberContainer = false;

memberButton.addEventListener("click", () => {
  if (activeMemberContainer) {
    memberContainer.style.display = "none";
  } else {
    memberContainer.style.display = "block";
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener("click", () => {
  if (activeChatContainer) {
    chatContainer.style.display = "none";
  } else {
    chatContainer.style.display = "block";
  }

  activeChatContainer = !activeChatContainer;
});

// Additional Functionibility
let displayFrame = document.getElementById("spotlight");
let videoFrames = document.getElementsByClassName("video-container");

let userIdDisplayFrame = null;

// expand video-frame and show it to spotlight
let expandVideoFrame = (e) => {
  let child = displayFrame.children[0];
  if (child) {
    document.getElementById("stream-container").appendChild(child);
  }
  displayFrame.style.display = "block";
  displayFrame.appendChild(e.currentTarget);
  userIdDisplayFrame = e.currentTarget.id;

  for (let i = 0; videoFrames.length > i; i++) {
    if (videoFrames[i].id != userIdDisplayFrame) {
      videoFrames[i].style.height = "100px";
      videoFrames[i].style.width = "100px";
    }
  }
};

for (let i = 0; videoFrames.length > i; i++) {
  videoFrames[i].addEventListener("click", expandVideoFrame);
}

// hiding the stream -- by clicking into the stream box

let hideStream = () => {
  userIdDisplayFrame = null;
  displayFrame.style.display = null;
  let child = displayFrame.children[0];
  document.getElementById("stream-container").appendChild(child);

  for (let i = 0; videoFrames.length > i; i++) {
    videoFrames[i].style.height = "15rem";
    videoFrames[i].style.width = "20rem";
  }
};

displayFrame.addEventListener("click", hideStream);
