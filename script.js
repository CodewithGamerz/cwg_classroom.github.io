/* =========================
   HOVER GLOW EFFECTS
========================= */
document.querySelectorAll("button, .card, .hex").forEach(el => {
  el.addEventListener("mouseenter", () => {
    el.style.boxShadow = "0 0 20px rgba(0,242,195,0.3)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.boxShadow = "";
  });
});


/* =========================
   BACKGROUND MUSIC
========================= */
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");

const volumeSlider = document.getElementById("volume-control");
const volDown = document.getElementById("vol-down");
const volUp = document.getElementById("vol-up");
const volPercent = document.getElementById("vol-percent");

let musicPlaying = false;


/* =========================
   VOLUME HANDLER (LOG SCALE)
========================= */
function updateVolume(value) {
  value = Math.min(1, Math.max(0, value)); // clamp 0–1
  volumeSlider.value = value;

  // Ultra-low quiet curve
  music.volume = value ** 3;

  volPercent.textContent = Math.round(value * 100) + "%";
}

// Initialize volume on load
updateVolume(parseFloat(volumeSlider.value));


/* =========================
   MUSIC TOGGLE BUTTON
========================= */
musicBtn.addEventListener("click", () => {
  if (!musicPlaying) {
    music.play();
    updateVolume(parseFloat(volumeSlider.value));
    musicBtn.textContent = "🔊";
    musicPlaying = true;
  } else {
    music.pause();
    musicBtn.textContent = "🔇";
    musicPlaying = false;
  }
});


/* =========================
   VOLUME CONTROLS
========================= */
// Slider
volumeSlider.addEventListener("input", () => {
  updateVolume(parseFloat(volumeSlider.value));
});

// Minus
volDown.addEventListener("click", () => {
  updateVolume(parseFloat(volumeSlider.value) - 0.05);
});

// Plus
volUp.addEventListener("click", () => {
  updateVolume(parseFloat(volumeSlider.value) + 0.05);
});

updateVolume(parseFloat(volumeSlider.value));


/* =========================
   UNIVERSAL PAGE / TAB NAVIGATION
========================= */
function showTab(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
    page.style.display = "none"; // hide everything
  });

  // Show the requested page
  const page = document.getElementById(pageId);
  page.classList.add("active");
  page.style.display = ""; // use CSS default (flex/grid)

  // If home, show its internal sections
  if (pageId === "home") {
    const homeSections = ["hero", "tutorials", "blueprints"];
    homeSections.forEach(sel => {
      const el = document.querySelector(`.${sel}`);
      if (el) el.style.display = ""; // reset to CSS
    });
  }

  // If video, show the videos-page section
  if (pageId === "video") {
    const videosPage = document.getElementById("videos-page");
    if (videosPage) videosPage.style.display = "";
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// Community Page Comment System
const commentInput = document.getElementById("comment-input");
const sendBtn = document.getElementById("comment-send");
const cancelBtn = document.getElementById("comment-cancel");
const editBtn = document.getElementById("comment-edit");
const commentsList = document.getElementById("comments-list");

let currentUser = localStorage.getItem("userId") || Date.now().toString();
localStorage.setItem("userId", currentUser);

let comments = JSON.parse(localStorage.getItem("comments")) || [];

// Render all comments
function renderComments() {
  commentsList.innerHTML = "";
  comments.forEach((c, index) => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-item");
    commentDiv.dataset.index = index;

    commentDiv.innerHTML = `
      <div class="author">${c.userId === currentUser ? "You" : "Anonymous"}</div>
      <div class="text">${c.text}</div>
      <div class="actions"></div>
    `;

    const actionsDiv = commentDiv.querySelector(".actions");

    // Only author or admin (you) can delete
    if (c.userId === currentUser || c.admin) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteComment(index);
      actionsDiv.appendChild(delBtn);
    }

    // Only author can edit
    if (c.userId === currentUser) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editComment(index);
      actionsDiv.appendChild(editBtn);
    }

    commentsList.appendChild(commentDiv);
  });
}

// Save comments to localStorage
function saveComments() {
  localStorage.setItem("comments", JSON.stringify(comments));
}

// Send comment
sendBtn.addEventListener("click", () => {
  const text = commentInput.value.trim();
  if (!text) return;
  comments.push({ text, userId: currentUser, admin: false });
  saveComments();
  renderComments();
  commentInput.value = "";
  commentInput.readOnly = true;
});

// Cancel typing
cancelBtn.addEventListener("click", () => {
  commentInput.value = "";
  commentInput.readOnly = true;
});

// Allow typing when textarea clicked
commentInput.addEventListener("click", () => {
  commentInput.readOnly = false;
  commentInput.focus();
});

// Delete comment
function deleteComment(index) {
  comments.splice(index, 1);
  saveComments();
  renderComments();
}

// Edit comment
function editComment(index) {
  const c = comments[index];
  commentInput.readOnly = false;
  commentInput.value = c.text;
  commentInput.focus();
  // Remove old comment
  comments.splice(index, 1);
  saveComments();
  renderComments();
}

// Initial render
renderComments();
