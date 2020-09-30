// dados
let devList = [];
// inputs
let inputSearch = null;
let checkBoxLang = null;
let radioLogOperator = null;
// filtros
let filterLogOperator = null;
let filterLanguages = [];
let filterName = "";
// elementos
let listDevs = null;
let form = null;
let devsSearch = null;
let preLoader = null;

window.addEventListener("load", async () => {
  getValues();
  await fetchDev();
  events();
});

function getValues() {
  inputSearch = document.querySelector("#search");
  checkBoxLang = document.querySelectorAll("[name='language']");
  radioLogOperator = document.querySelectorAll("[name='logicalOperators']");
  filterLogOperator = document.querySelector("[name='logicalOperators']:checked").id;
  
  devsSearch = document.querySelector("#devsSearch")
  form = document.querySelector("#searchForm");
  listDevs = document.querySelector("#devs");
  preLoader = document.querySelector("#preLoader");

  checkBoxLang.forEach((language) =>
    language.checked ? filterLanguages.push(language.id) : null
  );
}


async function fetchDev() {
  const req = await fetch("http://localhost:3001/devs");
  const res = await req.json();
  
  devList = res.map((dev) => {
    const { id, name, picture, programmingLanguages } = dev;
      
    const nameTreated = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f-\x20]/g, "");

    return {
      id,
      name,
      nameTreated,
      picture,
      programmingLanguages,
    };
  });
  devList = devList.map(
    ({ id, name, nameTreated, picture, programmingLanguages }) => {
      const progLanguageIcon = [];
      const languageTypes = [];

      programmingLanguages.forEach((languages) => {
        const { language, id} = languages;
        const idLowerCase = id.toLowerCase();
        languageTypes.push(language.toLowerCase());
        switch (language) {
          case "Java":
            progLanguageIcon.push({
              idLowerCase,
              language,
              icon: "./assets/java.png",
            });
            break;
          case "JavaScript":
            progLanguageIcon.push({
              idLowerCase,
              language,
              icon: "./assets/javascript.png",
            });
            break;
          case "Python":
            progLanguageIcon.push({
              idLowerCase,
              language,
              icon: "./assets/python.png",
            });
            break;
            default:
            break;
        }
      });
      return { 
        id, 
        name,
        nameTreated, 
        picture,
        languageTypes,
        progLanguageIcon,
      };
    }
  )
  renderDevList(devList);
  showPreLoader();
}

// events
function events() {
  inputSearch.addEventListener("input", handleKeyUp);
  checkBoxLang.forEach((checkBoxLang) => {
    checkBoxLang.addEventListener("input", handleSelectLanguage);
  });
  radioLogOperator.forEach((radioLogOperator) => {
    radioLogOperator.addEventListener("input", handleLogicalOperator);
  });
}

function showPreLoader() {
  setTimeout(() => {
    preLoader.classList.add("hidden");
    devsSearch.classList.remove("hidden");
    activaInput();
  }, 2000)
}

function handleSubmit(event) {
  event.preventDefault();
}

function activaInput() {
  inputSearch.focus();
}

function handleKeyUp(event) {
  filterName = event.target.value;
  filterDevs();
}

function handleSelectLanguage() {
  filterLanguages = [];
  const filter = document.querySelectorAll("[name=language]:checked");
  filter.forEach(({id}) => {
    filterLanguages.push(id);
  });
  filterDevs();
}

function handleLogicalOperator(event) {
  filterLogOperator = event.target.id;
  filterDevs();
}

// filtragem
function filterDevs() {
  let filterDevs = [];
  const filterLowerCase = filterName.toLowerCase();
  filterDevs = devList.filter((dev) => {
    return dev.nameTreated.includes(filterLowerCase);
  });
  filterDevs = filterDevs.filter((dev) => {
    return filterLogOperator == "or"
      ? filterLanguages.some((item) => dev.languageTypes.includes(item))
      : dev.languageTypes.join("") === filterLanguages.join("");
  });
  renderDevList(filterDevs);
}

// render
function renderDevList(devs) {
  listDevs.innerHTML = "";
  const h3 = document.createElement("h3");

  if (devs === null) {
    h3.innerHTML = "Não foi encontrado nenhum dev."
    listDevs.appendChild(h3);
  } else {
    h3.innerHTML = `${devs.length} devs encontrados`
    listDevs.appendChild(h3)
    const devHTML = ``

    devs.forEach((dev, index) => {
      const { name, picture, languageTypes, progLanguageIcon } = dev;
      
      const HTML = `
        <div class="dev">
          <img src="${picture}" alt="${name}" />
          <p>${name}</p>
          <img src="${progLanguageIcon}" alt="${languageTypes}">
        </div>
      `;
          devHTML.appendChild(HTML);
    });
    listDevs.appendChild(devHTML);
  }

}
