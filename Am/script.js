// ⚠️ مهم: آدرس زیر را پاک کن و آدرس Production URL خودت را داخل گیومه بگذار
const WEBHOOK_URL = "https://34109-qzpoy.s3.irann8n.com/webhook-test/win1"; 

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = inputField.value.trim();

    if (!message) return;

    // ۱. نمایش پیام کاربر در صفحه
    addMessage(message, 'user-message');
    inputField.value = '';
    
    // نمایش حالت "در حال تایپ..." (اختیاری)
    const loadingId = addMessage('...', 'bot-message');

    try {
        // ۲. ارسال به n8n
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatInput: message }) 
        });

        // ۳. دریافت جواب
        const data = await response.json();
        
        // حذف پیام "در حال تایپ"
        removeMessage(loadingId);

        // ۴. نمایش جواب ربات
        // سعی میکنیم reply رو بگیریم، اگه نبود output رو میگیریم
        const botReply = data.reply || data.output || JSON.stringify(data);
        addMessage(botReply, 'bot-message');

    } catch (error) {
        console.error('Error:', error);
        removeMessage(loadingId);
        addMessage('خطا در ارتباط با سرور.', 'bot-message');
    }
}

// توابع کمکی برای ساخت ظاهر پیام‌ها
function addMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.textContent = text;
    msgDiv.id = 'msg-' + Date.now();
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv.id;
}

function removeMessage(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

// زدن اینتر برای ارسال
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
