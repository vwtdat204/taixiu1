// --- Khởi tạo ---
let userData = { username: "", balance: 10000 };

// Lấy phần tử
const loginSection = document.getElementById("login-section");
const gameSection = document.getElementById("game-section");
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const logoutBtn = document.getElementById("logout-btn");
const userNameEl = document.getElementById("user-name");
const balanceEl = document.getElementById("balance");
const messageEl = document.getElementById("message");

const diceEls = [document.getElementById("dice1"), document.getElementById("dice2"), document.getElementById("dice3")];

// --- Load dữ liệu từ localStorage ---
function loadUserData() {
    const saved = localStorage.getItem("hitclub_user");
    if(saved) {
        userData = JSON.parse(saved);
        return true;
    }
    return false;
}

// --- Lưu dữ liệu ---
function saveUserData() {
    localStorage.setItem("hitclub_user", JSON.stringify(userData));
}

// --- Đăng nhập ---
loginBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if(!name) return alert("Nhập tên trước khi đăng nhập!");
    userData.username = name;
    if(!loadUserData()) saveUserData();
    startGame();
});

// --- Đăng xuất ---
logoutBtn.addEventListener("click", () => {
    loginSection.style.display = "block";
    gameSection.style.display = "none";
});

// --- Bắt đầu game ---
function startGame() {
    loginSection.style.display = "none";
    gameSection.style.display = "block";
    userNameEl.textContent = userData.username;
    balanceEl.textContent = userData.balance.toLocaleString();

    // Phát nhạc nền
    const bgMusic = document.getElementById("bg-music");
    bgMusic.play().catch(()=>{});
}

// --- Nạp vàng ảo ---
const topupButtons = document.querySelectorAll(".topup-buttons button");
const topupMsg = document.getElementById("topup-msg");

topupButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const amount = parseInt(btn.dataset.amount);
        const soundTopUp = new Audio("https://actions.google.com/sounds/v1/cartoon/coin_drop.ogg");
        soundTopUp.play();

        userData.balance += amount;
        balanceEl.textContent = userData.balance.toLocaleString();
        topupMsg.textContent = `Bạn đã nạp thành công ${amount.toLocaleString()} Vàng!`;
        setTimeout(() => topupMsg.textContent = "", 3000);
        saveUserData();
    });
});

// --- Cược Tài/Xỉu ---
function rollDice() {
    return Math.floor(Math.random()*6)+1;
}

function playGame(choice) {
    if(userData.balance <= 0) return alert("Bạn hết vàng! Hãy nạp thêm.");
    const dice = [rollDice(), rollDice(), rollDice()];
    diceEls.forEach((el,i) => el.textContent = dice[i]);

    const sum = dice.reduce((a,b)=>a+b,0);
    const result = sum >= 11 ? "Tài" : "Xỉu";

    if(choice === result) {
        const win = 1000;
        userData.balance += win;
        messageEl.textContent = `Bạn thắng! +${win.toLocaleString()} Vàng`;
    } else {
        const lose = 1000;
        userData.balance -= lose;
        messageEl.textContent = `Bạn thua! -${lose.toLocaleString()} Vàng`;
    }
    balanceEl.textContent = userData.balance.toLocaleString();
    saveUserData();
}

// --- Nút Tài/Xỉu ---
document.getElementById("tai-btn").addEventListener("click", ()=>playGame("Tài"));
document.getElementById("xiu-btn").addEventListener("click", ()=>playGame("Xỉu"));
