const items = [
  { name: "Ягідний гелькоут (Блакитне)", img: "rare.png", chance: 50, color: "#3146ff" },
  { name: "Clitched Paint (Фіолетове)", img: "M4A1S.png", chance: 20, color: "#8c48da" },
  { name: "Ледяне Вугілля (Рожеве)", img: "AK47.png", chance: 18, color: "#ff44e6" },
  { name: "Азімов (Красне)", img: "Asimow.png", chance: 9, color: "#ff6b6b" },
  { name: "Бабочка (Золоте)", img: "knife.png", chance: 3, color: "#ffd700" }
];

let userName = prompt("Введіть ваше ім'я:", "User");
if (!userName || userName.trim() === "") {
  userName = "User";
}
document.getElementById("playerName").textContent = userName;

let currentAttempt = 1;
const maxAttempts = Infinity;
let isSpinning = false;

const reel = document.getElementById("reel");
const openBtn = document.getElementById("openBtn");
const startScreen = document.getElementById("startScreen");
const statusText = document.getElementById("statusText");
const attemptsText = document.getElementById("attemptsText");

function getWeightedRandomItem() {
  const totalWeight = items.reduce((sum, item) => sum + item.chance, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    if (random < items[i].chance) {
      return items[i];
    }
    random -= items[i].chance;
  }
  return items[0];
}

function buildReel(winningItem) {
  reel.innerHTML = "";
  reel.style.transition = "none";
  reel.style.transform = "translateY(0px)";

  const totalCards = 35;
  const winIndex = 30;

  for (let i = 0; i < totalCards; i++) {
    const item = (i === winIndex) ? winningItem : items[Math.floor(Math.random() * items.length)];

    const div = document.createElement("div");
    div.className = "reel-item";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <span style="color: ${item.color}">${item.name}</span>
    `;
    reel.appendChild(div);
  }

  return winIndex;
}

openBtn.addEventListener("click", () => {
  if (isSpinning || currentAttempt > maxAttempts) return;

  isSpinning = true;
  openBtn.disabled = true;
  statusText.style.color = "#ffd700";
  statusText.textContent = "Підготовка до відкриття... (2 сек)";

  setTimeout(() => {
    startScreen.style.opacity = "0";
    setTimeout(() => { startScreen.style.display = "none"; }, 300);

    statusText.style.color = "#4dabf7";
    statusText.textContent = "Крутиться...";

    const winner = getWeightedRandomItem();
    const winIndex = buildReel(winner);

    const cardHeight = reel.firstElementChild.offsetHeight;
    const targetOffset = winIndex * cardHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reel.style.transition = "transform 4s cubic-bezier(0.1, 0.85, 0.2, 1)";
        reel.style.transform = `translateY(-${targetOffset}px)`;
      });
    });

    setTimeout(() => {
      statusText.style.color = winner.color;
      statusText.textContent = `Випало: ${winner.name}!`;

      currentAttempt++;
      isSpinning = false;

      if (currentAttempt <= maxAttempts) {
        attemptsText.textContent = `Спроба ${currentAttempt} з ${maxAttempts}`;
        openBtn.disabled = false;
        openBtn.textContent = "Відчинити ще раз";
      } else {
        attemptsText.textContent = "Спроби закінчились";
        openBtn.textContent = "Оновити гру";
        openBtn.disabled = false;
        openBtn.onclick = () => location.reload();
      }
    }, 4100);

  }, 2000);
});