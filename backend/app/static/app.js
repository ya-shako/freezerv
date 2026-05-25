let scanner = null;
let scanActive = false;

// Функция звука
function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    audioContext.resume();
}

// Автоматический старт сканера
async function startScanner() {
    if (scanner && scanActive) return;
    
    const readerElement = document.getElementById("reader");
    if (!readerElement) return;
    
    readerElement.innerHTML = "";
    
    scanner = new Html5Qrcode("reader");
    
    try {
        await scanner.start(
            { facingMode: "environment" },
            {
                fps: 30,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            async (barcode) => {
                if (!scanActive) return;
                
                // Звук при сканировании
                playBeep();
                
                // Останавливаем сканер
                scanActive = false;
                await scanner.stop();
                scanner = null;
                
                const resultDiv = document.getElementById("scanResult");
                resultDiv.innerHTML = "⏳ Отправка на сервер...";
                resultDiv.style.color = "#007aff";
                
                // Отправляем на сервер
                try {
                    const response = await fetch("/api/scan", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ barcode: barcode })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        resultDiv.innerHTML = `✅ ${data.product_name || "Продукт"} добавлен`;
                        resultDiv.style.color = "#4cd964";
                        if (typeof loadProducts === 'function') loadProducts();
                        
                        setTimeout(() => {
                            if (typeof showTab === 'function') showTab('list');
                        }, 1500);
                    } else {
                        resultDiv.innerHTML = `❌ ${data.detail || "Ошибка добавления"}`;
                        resultDiv.style.color = "#ff3b30";
                        
                        setTimeout(() => {
                            resultDiv.innerHTML = "";
                            startScanner();
                        }, 2000);
                    }
                } catch (error) {
                    resultDiv.innerHTML = "❌ Ошибка соединения с сервером";
                    resultDiv.style.color = "#ff3b30";
                    
                    setTimeout(() => {
                        resultDiv.innerHTML = "";
                        startScanner();
                    }, 2000);
                }
            },
            (error) => {
                console.log("Ошибка сканирования:", error);
            }
        );
        
        scanActive = true;
        document.getElementById("scanResult").innerHTML = "📷 Наведите камеру на штрихкод";
    } catch (err) {
        console.error("Ошибка запуска камеры:", err);
        document.getElementById("scanResult").innerHTML = "❌ Не удалось запустить камеру";
    }
}

// Остановка сканера
function stopScanner() {
    if (scanner && scanActive) {
        scanner.stop();
        scanner = null;
        scanActive = false;
    }
}

// Переключение вкладок
function showTab(tab) {
    const scanTab = document.getElementById("scanTab");
    const listTab = document.getElementById("listTab");
    const btns = document.querySelectorAll(".tab-btn");
    
    if (tab === "scan") {
        if (scanTab) scanTab.classList.add("active");
        if (listTab) listTab.classList.remove("active");
        if (btns[0]) btns[0].classList.add("active");
        if (btns[1]) btns[1].classList.remove("active");
        startScanner();
    } else {
        if (listTab) listTab.classList.add("active");
        if (scanTab) scanTab.classList.remove("active");
        if (btns[1]) btns[1].classList.add("active");
        if (btns[0]) btns[0].classList.remove("active");
        stopScanner();
        if (typeof loadProducts === 'function') loadProducts();
    }
}

// Запуск при загрузке
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(startScanner, 500);
});
