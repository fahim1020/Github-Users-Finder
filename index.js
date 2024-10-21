document.addEventListener("DOMContentLoaded", () => {
  //* Flag to track whether demo data has been loaded
  let isDemoLoaded = false;

  //* Document Elements
  const allUsers = document.getElementById("all-users");
  const searchInput = document.getElementById("user");
  const searchBtn = document.getElementById("search");
  const errorBox = document.getElementById("error-box");

  //* Api URL
  const apiUrl = "https://api.github.com/users/";

  //* Show Demo Function
  const showDemo = async () => {
    if (isDemoLoaded) return;

    for (let i = 0; i < 9; i++) {
      try {
        let user = await fetchData(apiUrl, i);
        if (user != null) {
          showData(user);
          //? console.log("User fetched successfully:", user);
        }
      } catch (error) {
        console.error("Error loading demo user:", error);
      }
    }

    isDemoLoaded = true;
  };

  //* Fetch Data
  const fetchData = async (apiUrl, userName) => {
    try {
      let data = await fetch(apiUrl + userName);
      if (data.ok) {
        data = await data.json();
        return data;
      } else {
        return null;
      }
    } catch (error) {
      //? console.error("Error fetching data:", error);
      return null;
    }
  };

  //* User Card Function
  const userCard = (imgSrc, name, followers, githubUrl) => {
    return `<div class="card">
      <div class="avatar-container">
        <img src="${imgSrc}" alt="User Avatar" class="avatar" />
      </div>
      <h2 class="name">${name}</h2>
      <p class="followers">Followers: ${followers}</p>
      <a href="${githubUrl}" class="profile-link">Visit GitHub Profile</a>
    </div>`;
  };

  //* Show Data
  const showData = (user) => {
    //? console.log(user);
    const { avatar_url, name, followers, html_url } = user;
    allUsers.insertAdjacentHTML(
      "beforeend",
      userCard(avatar_url, name, followers, html_url)
    );
  };

  //* Custom data show
  const customShowData = async (api, username) => {
    const user = await fetchData(api, username);
    // console.log(user);
    if (user !== null) {
      const { avatar_url, name, followers, html_url } = user;
      allUsers.innerHTML = userCard(avatar_url, name, followers, html_url);
    } else {
      errorBox.innerHTML = `
      <div class="alert">
        <strong>Error:</strong> User not found. Please try again.
      </div>
    `;
      allUsers.innerHTML = "";
      isDemoLoaded = false;
    }
  };

  //* Event listeners
  searchBtn.addEventListener("click", () => {
    if (searchInput.value) {
      customShowData(apiUrl, searchInput.value);
      isDemoLoaded = false;
    }
  });
  window.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value) {
      searchBtn.click();
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      errorBox.innerHTML = "";
      showDemo();
    }
  });

  //* Initial demo content
  showDemo();
});
