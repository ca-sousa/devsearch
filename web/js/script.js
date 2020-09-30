let devList = [];

window.addEventListener('load', start);

function start() {
    totalDevs = document.querySelector('#totalSearch')
    listDevs = document.querySelector('#devs')
    form = document.querySelector('form')

    form.addEventListener("submit", handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();

    const name = document.querySelector("#name");
    const java = document.querySelector("#java");
    const js = document.querySelector("#javascript");
    const python = document.querySelector("#python");
    const and = document.querySelector("#optionAnd");
    const or = document.querySelector("#optionOr")

    console.log(java.value)
    form.submit(featchDev);
}

async function featchDev() {
    const req = await fetch('http://localhost:3001/devs');
    const res = await req.json();

    devList = res.map((dev) => {
        const { name, picture, programmingLanguages } = dev

        return {
            name, 
            picture, 
            programmingLanguages, 
        };
    });
    renderDevList();
}

function renderDevList() {
    let devsHTML = "<div class='devs'>";

    devList.forEach((dev, index) => {
        const { name, picture, programmingLanguages } = dev

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