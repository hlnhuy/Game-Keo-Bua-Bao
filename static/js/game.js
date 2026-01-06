const socket = io();
let myName = "";

// Hàm xử lý khi người dùng nhấn "BẮT ĐẦU"
function enterGame() {
    const input = document.getElementById('username');
    if(input.value.trim()) {
        myName = input.value;
        // Gửi sự kiện tham gia game lên server
        socket.emit('join_game', {name: myName});
        
        // Ẩn màn hình nhập tên, hiện màn hình game
        document.getElementById('setup-area').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        document.getElementById('my_name_display').innerText = myName;
        document.getElementById('status').innerText = "Đang chờ đối thủ để bắt đầu...";
    }
}
socket.on('start_countdown', (data) => {
    // Cập nhật tên đối thủ lên bảng điểm
    document.getElementById('op_name_display').innerText = data.op_name;
    document.getElementById('status').innerText = "Trận đấu bắt đầu! Hãy chọn...";
    document.getElementById('choice-buttons').classList.remove('pointer-events-none', 'opacity-30');
    startTimer(); 
});

function startTimer() {
    timeLeft = 10;
    document.getElementById('timer').innerText = timeLeft;
    document.getElementById('timer').classList.remove('text-red-500');
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if(timeLeft <= 3) document.getElementById('timer').classList.add('text-red-500');
        
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            pick('none'); // Tự động xử thua khi hết giờ
        }
    }, 1000);
}

function pick(choice) {
    clearInterval(timerInterval);
    socket.emit('make_choice', {choice: choice});
    document.getElementById('choice-buttons').classList.add('pointer-events-none', 'opacity-30');
    document.getElementById('status').innerText = choice === 'none' ? "Hết thời gian!" : "Đã chọn " + choice.toUpperCase();
}
socket.on('game_end', (data) => {
    const overlay = document.getElementById('result-overlay');
    const title = document.getElementById('result-title');
    
    overlay.classList.remove('hidden', 'border-green-500', 'border-red-500', 'border-slate-500');
    
    if(data.my_res === "Thắng") {
        title.innerText = "CHIẾN THẮNG!";
        title.className = "text-6xl font-black mb-4 italic text-green-500";
        overlay.classList.add('border-green-500');
    } else if(data.my_res === "Thua") {
        title.innerText = "THẤT BẠI!";
        title.className = "text-6xl font-black mb-4 italic text-red-500";
        overlay.classList.add('border-red-500');
    } else {
        title.innerText = "HÒA NHAU!";
        title.className = "text-6xl font-black mb-4 italic text-slate-400";
        overlay.classList.add('border-slate-500');
    }
    
    const myChoiceText = data.my_choice === 'none' ? "Bỏ cuộc" : data.my_choice;
    const opChoiceText = data.op_choice === 'none' ? "Bỏ cuộc" : data.op_choice;
    document.getElementById('result-detail').innerText = `Bạn: ${myChoiceText} | Đối thủ: ${opChoiceText}`;
    
    document.getElementById('my-score').innerText = data.my_score;
    document.getElementById('op-score').innerText = data.op_score;
    document.getElementById('op_name_display').innerText = data.op_name;

    document.getElementById('play-card').classList.add('hidden');
    overlay.classList.remove('hidden');
});

function resetGame() {
    document.getElementById('result-overlay').classList.add('hidden');
    document.getElementById('play-card').classList.remove('hidden');
    document.getElementById('choice-buttons').classList.add('pointer-events-none', 'opacity-30');
    document.getElementById('status').innerText = "Đang chờ đối thủ...";
    document.getElementById('timer').innerText = "10";
    socket.emit('join_next_round');
}