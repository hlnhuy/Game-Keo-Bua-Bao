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