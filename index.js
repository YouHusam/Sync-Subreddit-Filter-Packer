const files = [{ name: "pr0n", path: "pr0n.json" }];

var settingsFilters = {
  filter_subreddit: [],
};

function populateButtons() {
  const buttonContainer = document.getElementById("button-container");
  files.forEach((file) => {
    const button = document.createElement("button");
    button.onclick = () => loadFile(file.path);
    button.innerText = file.name;
    buttonContainer.appendChild(button);
  });
}

function readSingleFile(e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    const contents = e.target.result;
    const originalSettings = JSON.parse(contents);
    let filters = [];
    if (originalSettings.filter_subreddit) {
      filters = [...originalSettings.filter_subreddit];
    }
    setFilterSettings(filters);
  };
  reader.readAsText(file);
}

function displayContents() {
  const contents =
    "Total: " +
    settingsFilters.filter_subreddit.length +
    "\n" +
    settingsFilters.filter_subreddit.join(", ");
  const element = document.getElementById("file-content");
  element.textContent = contents;
}

function loadFile(filePath) {
  let result = null;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", function () {
    if (this.status == 200) {
      result = this.responseText;
      setFilterSettings([...JSON.parse(result).filter_subreddit]);
    }
  });
  xmlhttp.open("GET", filePath, true);
  xmlhttp.send();
}

function setFilterSettings(filters) {
  const merged = settingsFilters.filter_subreddit.concat(filters);
  const unique = [...new Set(merged)];
  settingsFilters.filter_subreddit = unique;
  displayContents();
}

function download() {
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(settingsFilters)], {
    type: "text/json",
  });
  a.href = URL.createObjectURL(file);
  a.download = "sync_backup_filters.json";
  a.click();
}

function applyExtras() {
  let filters = document.getElementById("extra-filters-input").value;
  filters = filters.replace(/r\/|\/r\/| /gi, "");
  const filterList = filters.split(",");
  setFilterSettings(filterList);
}

document
  .getElementById("file-input")
  .addEventListener("change", readSingleFile, false);

populateButtons();
