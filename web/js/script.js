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

window.addEventListener("load", async () => {
  getValues();
  await fetchDev();
});

function getValues() {
  inputSearch = document.querySelector("#search");
  checkBoxLang = document.querySelectorAll("[name='language']");
  radioLogOperator = document.querySelectorAll("[name='logicalOperators']");
  filterLogOperator = document.querySelector("[name='logicalOperators']:checked").id;
  
  devsSearch = document.querySelector("#devsSearch")
  form = document.querySelector("#searchForm");
  listDevs = document.querySelector("#devs");

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
  // renderDevList(devList);
  console.log(devList)
}

function handleSubmit(event) {
  event.preventDefault();

  form.submit(featchDev);
}

function renderDevList() {
  let devsHTML = "<div class='devs'>";
  
  devList.forEach((dev, index) => {
    const { name, picture, programmingLanguages } = dev;
    
    const devHTML = `
    <div class="dev">
    <div class="picture">
    <img src="${picture}" alt="${name}" />
    </div>
    <p>${name}</p>
                <div>
                    <p>${programmingLanguages}</p>
                </div>
            </div>
        `;

    devsHTML += devHTML;
  });
}
