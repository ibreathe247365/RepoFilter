alert("Keep API-requests limited!");//Even a VPN doesn't work!

// Get the GitHub input form
const gitHubForm = document.getElementById("gitHubForm");

// Listen for submissions on GitHub input form
gitHubForm.addEventListener("submit", (e) => {
  // Prevent default form submission action
  e.preventDefault();

  // Get the GitHub username input field on the DOM
  let usernameInput = document.getElementById("usernameInput");
  // Get the value of the GitHub username input field
  let gitHubUsername = usernameInput.value;

  // Get the GitHub Repo_count(n) input field on the DOM
  let Repo_count = document.getElementById("Repo_count");
  // Get the value of the Repo_count username input field
  let n = Repo_count.value;

  // Get the GitHub Commitee_count(m) input field on the DOM
  let Commitee_count = document.getElementById("Commitee_count");
  // Get the value of the Commitee_count username input field
  let m = Commitee_count.value;


  // Run GitHub API function, passing in the GitHub username
  requestUserRepos(gitHubUsername, n, m);
} );

function requestUserRepos(username, n, m) {

  //Counter variable for Repo_count(n)
  var c = 0 ;

  //API request limited(20) to 2000 repositories per organisation..Can be increased.
  for (let j = 1; j <= 20; j++) {
    
    
    // Create new XMLHttpRequest object
    xhr = new XMLHttpRequest();

    // GitHub endpoint, dynamically passing in specified username and page number.
    url = `https://api.github.com/search/repositories?o=desc&q=${username}&s=forks&per_page=100&page=${j}`;

    // Open a new connection, using a GET request via URL endpoint
    // Providing 3 arguments (GET/POST, The URL, Async True/False)
    xhr.open("GET", url, true);

    // When request is received
    // Process it here
    xhr.onload = function () {

      // Parse API data into JSON
      data = JSON.parse(this.response);

      // Loop over each object in data array
      for (let i in data.items) {
        
        c=c+1;
        if (c > n) {
          break;
        }
        
        // Get the ul with id of of userRepos
        let ul = document.getElementById("userRepos");
        
        // Create variable that will create li's to be added to ul
        let li = document.createElement("li");
        
        // Add Bootstrap list item class to each li
        li.classList.add("list-group-item");
        
        // Create the html markup for each li
        li.innerHTML = `
                    <p><strong>Repo:</strong> ${data.items[i].name}</p>
                    <p><strong>Description:</strong> ${data.items[i].description}</p>
                    <p><strong>Forks:</strong> ${data.items[i].forks}</p>
                    <p><strong>URL:</strong> <a href="${data.items[i].html_url}">${data.items[i].html_url}</a></p>
                    <ul id="contributers_list">Top-Contributers</ul>
                `;

        //Add commitees and commit_count
        fetchContributers(username,data.items[i].name,m);

        // console.log(data.items[i]);
        // Append each li to the ul
        ul.appendChild(li);
        // console.log(c);//Enable for debugging.
      }
    };
    // Send the request to the server
    xhr.send();

    if (j*100 >= n){//reduce no.of API calls
      return;
    }
  }
}

function fetchContributers(username,repo_name,m){
    //Counter variable for Commitee_count(m)
    var d=0;

    //New XML Request Object
    xhr = new XMLHttpRequest();
    //Endpoint(Auto-sorted by the API,yay!)
    //Limited to 100 contributers.
    url=`https://api.github.com/repos/${username}/${repo_name}/contributers?per_page=100`

    xhr.open("GET", url, true);
    xhr.onload = function () {

        // Parse API data into JSON
        const contributers_data = JSON.parse(this.response);
        console.log(contributers_data);//For debugging
        for (let i in contributers_data) {

            d=d+1;
            if (d > m) {
            break;
            }

            // Get the ul with id of of userRepos
            let ul = document.getElementById("contributers_list");
            
            // Create variable that will create li's to be added to ul
            let li = document.createElement("li");

            // Add Bootstrap list item class to each li
            li.classList.add("list-group-item");
            //Debug
            console.log(contributers_data[i].login);
            console.log(contributers_data[i].contributions);

            // Create the html markup for each li
            li.innerHTML = `<div>${contributers_data[i].login}<div>${contributers_data[i].contributions}</div></div>`
            ul.appendChild(li);
        }
    }
}