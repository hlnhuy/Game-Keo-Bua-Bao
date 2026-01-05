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
