const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("open");
    if (mobileMenu.classList.contains("max-h-0")) {
        mobileMenu.classList.remove("max-h-0");
        mobileMenu.classList.add("max-h-screen");
    } else {
        mobileMenu.classList.add("max-h-0");
        mobileMenu.classList.remove("max-h-screen");
    }
});


const phrases = ["Bob", "Developer", "Designer"];
const typingElement = document.getElementById("typing");

let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = [];
let isDeleting = false;
let isEnd = false;

function loop() {
    isEnd = false;
    typingElement.innerHTML = currentPhrase.join("");

    if (phraseIndex < phrases.length) {
        if (!isDeleting && letterIndex <= phrases[phraseIndex].length) {
            currentPhrase.push(phrases[phraseIndex][letterIndex]);
            letterIndex++;
            typingElement.innerHTML = currentPhrase.join("");
        }

        if (isDeleting && letterIndex <= phrases[phraseIndex].length) {
            currentPhrase.pop();
            letterIndex--;
            typingElement.innerHTML = currentPhrase.join("");
        }

        if (letterIndex === phrases[phraseIndex].length) {
            isEnd = true;
            isDeleting = true;
        }

        if (isDeleting && letterIndex === 0) {
            currentPhrase = [];
            isDeleting = false;
            phraseIndex++;
            if (phraseIndex === phrases.length) {
                phraseIndex = 0;
            }
        }
    }

    const typingSpeed = isEnd ? 2000 : isDeleting ? 100 : 150;
    setTimeout(loop, typingSpeed);
}

loop();




// console message
// Try to block right-click (basic protection)
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Detect if DevTools is opened
(function () {
    const devtools = /./;
    devtools.toString = function () {
        console.log("%c🕵️ Nice try hacker! 😆", "color: red; font-size: 20px; font-weight: bold;");
        console.log("%cBut you can’t really hide code from the browser!", "color: orange; font-size: 14px;");
        return "";
    };
    console.log("%cHello curious developer 👋", "color: green; font-size: 16px;");
    console.log(devtools); // triggers when console is opened
})();


// header section
// 🔹 Active nav highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

function setActiveLink() {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100; // offset for header height
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("bg-yellow-400", "border-black", "rounded-md", "shadow-[3px_3px_0_0_black]");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("bg-yellow-400", "border-black", "rounded-md", "shadow-[3px_3px_0_0_black]");
    }
  });
}

// run on scroll + on load
window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);

// also highlight immediately on click
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("bg-yellow-400", "border-black", "rounded-md", "shadow-[3px_3px_0_0_black]"));
    link.classList.add("bg-yellow-400", "border-black", "rounded-md", "shadow-[3px_3px_0_0_black]");
  });
});

const mobileLinks = document.querySelectorAll("#mobile-menu a");

mobileLinks.forEach(link => {
  link.addEventListener("click", () => {
    // close hamburger
    menuBtn.classList.remove("open");

    // close mobile menu
    mobileMenu.classList.add("max-h-0");
    mobileMenu.classList.remove("max-h-screen");
  });
});


