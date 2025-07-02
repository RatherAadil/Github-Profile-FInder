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

// const items = JSON.parse(localStorage.getItem("items")) || { theme: "dark" };

let toggleTheme = () => {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.contains("dark")
      ? (themeToggleBtn.textContent = "☀️")
      : (themeToggleBtn.textContent = "🌙");
  });
  // localStorage.setItem("items", JSON.stringify(items));
};
toggleTheme();

let userName;
function initUser() {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    userName = userInput.value.toLowerCase().trim();
    if (userName.includes(" ")) {
      userName = userName.split(" ").join("");
    }
    hideUser.classList.add("hidden");
    getUserDetails(userName);
    getUserRepos(userName);
  });
}
initUser();
function getUserDetails(userName) {
  fetch(`https://api.github.com/users/${userName}`)
    .then((res) => {
      if (res.status === 404) {
        throw new Error("Please try valid username");
      } else if (res.status === 403) {
        throw new Error("API Limit exceeded");
      } else {
        errorMessage.classList.add("hidden");
        return res.json();
      }
    })
    .then((data) => {
      displayUserDetails(data);
    })
    .catch((error) => {
      showError(error.message);
    });
}

let showError = (error) => {
  errorMessage.classList.remove("hidden");
  errorMessage.textContent = error;
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
  // console.log(data);
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

let getUserRepos = (user) => {
  fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=6`)
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error(data.message || "Unexpected response");
      }
      reposGrid.innerHTML = "";
      data.forEach((repo) => {
        const card = createRepoCard(repo);
        if (!reposGrid) return;
        reposGrid.append(card);
      });
    })
    .catch((err) => {
      console.error("Error fetching repos:", err.message);
    });
};

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
                  <span class="language-dot"></span>
                ${repo.language}
                </span>
                <span class="repo-stat">⭐ ${
                  repo.stargazers_count
                } starts</span>
                <span class="repo-stat">🍴 ${repo.forks_count}</span>
              </div>
            </div>
      </a>`;
  repoCard.innerHTML = innerHtml;
  return repoCard;
}
