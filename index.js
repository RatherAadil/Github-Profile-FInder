themeToggleBtn = document.querySelector("#toggle-theme");
userInput = document.querySelector("#user-input");
submitBtn = document.querySelector("#submit-btn");
errorMessage = document.querySelector("#error-message");
hideUser = document.querySelector("#hidden");
avatarImage = document.querySelector("#avatar");
profileName = document.querySelector("#profileName");
profileUserName = document.querySelector("#profileUsername");
profileBio = document.querySelector("#profileBio");
reposCount = document.querySelector("#reposCount");
followersCount = document.querySelector("#followersCount");
followingCount = document.querySelector("#followingCount");
joinDate = document.querySelector("#joinDate");
profileLink = document.querySelector("#profileLink");
copyBtn = document.querySelector("#copyBtn");
reposGrid = document.querySelector("#reposGrid");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggleBtn.textContent = "☀️";
} else {
  themeToggleBtn.textContent = "🌙";
}
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark"); // toggle first
  localStorage.setItem("theme", isDark ? "dark" : "light");

  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
});

// let userName;
function initUser() {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (userInput.value.length === 0) {
      showError("please Enter a valid username");
      return;
    } else {
      hideError();
      const userName = processUserInput(userInput.value);
      hideUser.classList.add("hidden");
      try {
        const userDetails = getUserDetails(userName);
        userDetails.then((data) => {
          displayUserDetails(data);
        });
        getUserRepos(userName);
      } catch (err) {
        console.log(err.message);
      }
    }
  });
}
initUser();
async function getUserDetails(userName) {
  try {
    const res = await fetch(`https://api.github.com/users/${userName}`);
    if (res.status === 404) {
      throw new Error("User not found. Please check the username.");
    } else if (res.status === 403) {
      throw new Error("API rate limit exceeded. Please try again later.");
    } else if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    showError(err.message);
  }
}

let showError = (error) => {
  errorMessage.classList.remove("hidden");
  errorMessage.textContent = error;
  hideUser.classList.add("hidden");
};
let hideError = () => {
  if (!errorMessage.classList.contains("hidden")) {
    errorMessage.classList.add("hidden");
  }
};

let processUserInput = (input) => {
  const trimmedInput = input.toLowerCase().trim();
  return trimmedInput.replace(/\s+/g, "");
};

let displayUserDetails = (data) => {
  const {
    avatar_url,
    name,
    login,
    bio,
    public_repos,
    followers,
    following,
    created_at,
    html_url,
  } = data;

  hideUser.classList.remove("hidden");
  avatarImage.src = avatar_url;
  profileName.textContent = name;
  profileUserName.textContent = `@${login}`;
  profileBio.textContent = bio || "No Bio Available";
  reposCount.textContent = public_repos;
  followersCount.textContent = followers;
  followingCount.textContent = following;
  joinDate.textContent = created_at.split("-")[0];
  profileLink.href = html_url;
};

copyBtn.addEventListener("click", () => {
  const url = profileLink.href;
  navigator.clipboard.writeText(url).then(() => {
    copyBtn.innerHTML = "✅ Copied!";
    setTimeout(() => {
      copyBtn.innerHTML = "📋 Copy URL";
    }, 2000);
  });
});

async function getUserRepos(user) {
  try {
    const res = await fetch(
      `https://api.github.com/users/${user}/repos?sort=updated&per_page=6`
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error(data.message || "Unexpected response");
    }

    reposGrid.innerHTML = "";
    if (data.length === 0) {
      reposGrid.innerHTML =
        "<p class='text-gray-500 text-center'>No repositories found.</p>";
      return;
    }

    data.forEach((repo) => {
      const card = createRepoCard(repo);
      reposGrid.appendChild(card);
    });
  } catch (err) {
    console.log("Error fetching repos:", err.message);
  }
}

function createRepoCard(repo) {
  let repoCard = document.createElement("div");
  repoCard.className = "repo-card";

  let innerHtml = `
        <a href='${repo.html_url}' target=_blank>
          <h4 class="repo-name">${repo.name}</h4>
                  <p class="repo-description">
                    ${repo.description || "No description available"}
                  </p>
                  <div class="repo-stats">
                    <span class="repo-stat">
                      <span ><svg class='fill-cyan-600' aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-dot-fill mr-2">
    <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
</svg></span>
                    ${repo.language}
                    </span>
                    <span class="repo-stat"><svg class='dark:fill-white' aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star d-inline-block mr-2">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
</svg> ${repo.stargazers_count} stars</span>
                    <span class="repo-stat"><svg class='dark:fill-white' aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked mr-2">
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
</svg> ${repo.forks_count}</span>
                  </div>
                </div>
        </a>`;
  repoCard.innerHTML = innerHtml;
  return repoCard;
}
