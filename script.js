let data;

async function loadData() {
    const res = await fetch("data.json");
    data = await res.json();

    processData();
    render();
    logicSlider();
    removeItem();
    updateUI();
}

let logos = [];
let names = [];
let descriptions = [];
let states = [];

function processData() {

    data.forEach(({description, isActive, logo, name}) => {
        logos.push(logo);
        names.push(name);
        descriptions.push(description);
        states.push(isActive);
    })

    console.log(states);
}

loadData();

const gridSection = document.querySelector(".content-container");

function render() {
    for (let i = 0; i < data.length; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add("grid-item");
        gridSection.appendChild(gridItem);

        const gridItemTop = document.createElement("div");
        gridItemTop.classList.add("grid-item__top");
        gridItem.appendChild(gridItemTop);

        const gridItemBottom = document.createElement("div");
        gridItemBottom.classList.add("grid-item__bottom");
        gridItem.appendChild(gridItemBottom);

        const itemImage = document.createElement("div");
        itemImage.classList.add("grid-item__img");
        itemImage.style.backgroundImage = `url(${logos[i]})`;
        gridItemTop.appendChild(itemImage);

        const itemText = document.createElement("div");
        itemText.classList.add("grid-item__text");
        gridItemTop.appendChild(itemText);

        const headline = document.createElement("h3");
        headline.innerText = names[i];
        itemText.appendChild(headline);

        const description = document.createElement("p");
        description.innerText = descriptions[i];
        itemText.appendChild(description);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.classList.add("btn-remove");
        removeButton.innerText = "Remove";
        gridItemBottom.appendChild(removeButton);

        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("slider-container");
        sliderContainer.tabIndex = 0;
        sliderContainer.setAttribute("data-active", states[i]);
        if (sliderContainer.getAttribute("data-active") === "true") {
            sliderContainer.classList.add("active");
        }
        gridItemBottom.appendChild(sliderContainer);

        const slider = document.createElement("div");
        slider.classList.add("slider");
        sliderContainer.appendChild(slider);
    }
    filterButtons.forEach((button) => {
        if (button.getAttribute("data-btn") === "filter-all") {
            button.classList.add("active");
        }
    })
}

const themeSwitcher = document.querySelector(".theme-switcher");
const htmlEl = document.documentElement;
themeSwitcher.addEventListener("click", (event) => {
    if (htmlEl.getAttribute("data-theme") === "light") {
        htmlEl.setAttribute("data-theme", "dark");
    } else {
        htmlEl.setAttribute("data-theme", "light");
    }
})

function logicSlider() {
    const sliderContainers = document.querySelectorAll(".slider-container");
    for (let i = 0; i < sliderContainers.length; i++) {
        const slider = sliderContainers[i];
        slider.addEventListener("click", (event) => {
            if (slider.getAttribute("data-active") === "false") {
                slider.setAttribute("data-active", "true")
                updateUI(true);
            } else {
                slider.setAttribute("data-active", "false");
                updateUI(false);
            }
            slider.classList.toggle("active");
        })

        slider.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                if (slider.getAttribute("data-active") === "false") {
                    slider.setAttribute("data-active", "true")
                    updateUI(true);
                } else {
                    slider.setAttribute("data-active", "false");
                    updateUI(false);
                }
                slider.classList.toggle("active");
            }
        })
    }
}

function removeItem() {
    const removeButtons = document.querySelectorAll(".btn-remove");
    for (let i = 0; i < removeButtons.length; i++) {
        const removeButton = removeButtons[i];
        const sliderContainers = document.querySelectorAll(".slider-container");
        const gridItems = document.querySelectorAll(".grid-item");
        removeButton.addEventListener("click", (event) => {
            if (sliderContainers[i].getAttribute("data-active") !== "removed") {
                sliderContainers[i].setAttribute("data-active", "removed");
            }
            gridItems[i].remove();
        })
    }
}

const filterButtons = document.querySelectorAll(".btn-filter");
filterButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        filterButtons.forEach(button => button.classList.remove("active"));
        button.classList.toggle("active");
        filterUI(event.target);
    })
})

function filterUI(button) {
    const gridItems = document.querySelectorAll(".grid-item");
    if (button.classList.contains("active")) {
        if (button.getAttribute("data-btn") === "filter-all") {
            gridItems.forEach(gridItem => {
                gridItem.style.display = "grid";
            })
        }

        if (button.getAttribute("data-btn") === "filter-active") {
            filterActive();
        }

        if (button.getAttribute("data-btn") === "filter-inactive") {
            filterInactive();
        }
    }
}

function filterActive() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(gridItem => {
        if (gridItem.querySelector(".slider-container").getAttribute("data-active") === "true") {
            gridItem.style.display = "grid";
        } else gridItem.style.display = "none";
    })
}

function filterInactive() {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach(gridItem => {
        if (gridItem.querySelector(".slider-container").getAttribute("data-active") === "false") {
            gridItem.style.display = "grid";
        } else gridItem.style.display = "none";
    })
}

function updateUI(bool) {
    filterButtons.forEach(button => {
        if (button.classList.contains("active")) {
            if (button.getAttribute("data-btn") === "filter-active" && !bool) {
                filterActive();
            }
            if (button.getAttribute("data-btn") === "filter-inactive" && bool) {
                filterInactive();
            }
        }
    })
}

const footer = document.getElementById("footer");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            footer.classList.add("visible");
        } else {
            footer.classList.remove("visible");
        }
    });
}, {threshold: 1.0}); // 100% sichtbar

observer.observe(footer);