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

let toggleTheme = () => {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.contains("dark")
      ? (themeToggleBtn.textContent = "☀️")
      : (themeToggleBtn.textContent = "🌙");
  });
};
toggleTheme();

let userName;
// userInput.addEventListener("input", () => {
//   userName = userInput.target.value.toLowerCase();
//   let updatedUserName;
//   if (userName.includes(" ")) {
//     updatedUserName = userName.split(" ").join("");
//   }
//   userName = updatedUserName;
// });

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  userName = userInput.value.toLowerCase().trim();
  if (userName.includes(" ")) {
    userName = userName.split(" ").join("");
  }
  //   console.log(userName);
  hideUser.classList.add("hidden");
  getUser(userName);
});

async function getUser(userName) {
  let response = await fetch(`https://api.github.com/users/${userName}`)
    .then((res) => {
      if (res.status === 404) {
        throw new Error("Please try valid username");
      } else {
        errorMessage.classList.add("hidden");
        return res.json();
      }
    })
    .then((data) => {
      displayUserDetails(data);
    })
    .catch((error) => {
      // handle all thrown errors here
      console.error(error.message);
      showError(error.message);
    });
}

let showError = (error) => {
  errorMessage.classList.remove("hidden");
  errorMessage.textContent = error;
};

let displayUserDetails = (data) => {
  hideUser.classList.remove("hidden");
  avatarImage.src = data.avatar_url;
  profileName.textContent = data.name;
  profileUserName.textContent = `@${data.login}`;
  profileBio.textContent = data.bio || "No Bio Available";
  reposCount.textContent = data.public_repos;
  followersCount.textContent = data.followers;
  followingCount.textContent = data.following;
  joinDate.textContent = data.created_at.split("-")[0];
  profileLink.href = data.html_url;
  console.log(data);
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
