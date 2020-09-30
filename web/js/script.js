let radioOr;
let radioAnd;
let checkJava;
let checkJS;
let checkPython;
let devList = [];
let devName;
let resultsDiv;
let markedLangs = [];
let globalCondition;
let countDevs;
let displayedList = [];
window.addEventListener('load', () => {
  radioOr = document.querySelector('#radioOr');
  radioAnd = document.querySelector('#radioAnd');
  checkJava = document.querySelector('#checkJava');
  checkJS = document.querySelector('#checkJS');
  checkPython = document.querySelector('#checkPython');
  resultsDiv = document.querySelector('#results');
  devName = document.querySelector('#devName');
  countDevs = document.querySelector('#countDevs');
  fetchDevs();
});

async function fetchDevs() {
  const req = await fetch('http://localhost:3001/devs');
  const data = await req.json();

  devList = data.map((dev) => {
    const { name, picture, programmingLanguages } = dev;
    return {
      name,
      picture,
      languages: programmingLanguages.map((lang) => lang.language).sort(),
      nameSearch: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''), //retirando caract. especiais,
    };
  });
  displayedList = devList;
  console.log(displayedList);
  render();
}

function render() {
  renderDevList();
  handleActions();
}

function renderDevList() {
  countDevs.textContent = `Devs encontrados: ${displayedList.length}`;
  displayedList.sort((a, b) => a.name.localeCompare(b.name));
  let devListHTML = '<div class="devList">';
  displayedList.forEach((dev) => {
    const { name, picture, languages } = dev;
    const iconLabelHTML = getIconLabel(languages);
    const devHTML = `
    <div class ="dev">
    <img src="${picture}" class="profile-pic">
    <div class = "dev-details">
    <p>${name}</p>
    ${iconLabelHTML}
    </div>
    </div>
    `;
    devListHTML += devHTML;
  });
  devListHTML += '</div>';
  resultsDiv.innerHTML = devListHTML;
}

function getIconLabel(languages) {
  let iconLabel = '<span class="icones">';
  languages.forEach((language) => {
    iconLabel += `<img src="./assets/${language.toLowerCase()}.png" class="icone"/>`;
  });
  iconLabel += '</span>';
  return iconLabel;
}

function handleActions() {
  checkJava.addEventListener('click', () => {
    filterByLanguage('Java', checkJava.checked);
  });
  checkJS.addEventListener('click', () => {
    filterByLanguage('JavaScript', checkJS.checked);
  });
  checkPython.addEventListener('click', () => {
    filterByLanguage('Python', checkPython.checked);
  });

  radioOr.addEventListener('click', () => {
    globalCondition = 'or';
    filterByCondition(globalCondition);
  });
  radioAnd.addEventListener('click', () => {
    globalCondition = 'and';
    filterByCondition(globalCondition);
  });
  devName.addEventListener('input', () => {
    filterByCondition(globalCondition);
  });
}

function filterByLanguage(language, checked) {
  if (checked === true) {
    markedLangs.push(language);
  } else {
    markedLangs.splice(markedLangs.indexOf(language), 1);
  }
  markedLangs.sort();
  filterByCondition(globalCondition);
}

function filterByCondition(condition) {
  if (markedLangs.length > 0) {
    if (condition === 'or') {
      displayedList = devList.filter((dev) =>
        dev.languages.some((lang) => markedLangs.includes(lang))
      );
    } else {
      if (markedLangs.length > 0) {
      }
      displayedList = devList.filter(
        (dev) => dev.languages.join() == markedLangs.join()
      );
    }
  } else {
    displayedList = devList;
  }

  filterByName(devName.value);
  console.log(displayedList);
  console.log(markedLangs);
  renderDevList();
}

function filterByName(name) {
  if (name != '' && name != undefined && name != null) {
    displayedList = devList.filter((dev) =>
      dev.nameSearch.includes(name.trim())
    );
  }
}
