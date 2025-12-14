// 🔴 فقط این آدرس رو با وبهوک n8n خودت عوض کن
const WEBHOOK_URL = "https://34109-qzpoy.s3.irann8n.com/webhook-test/win1";

const messages = document.getElementById("messages");
const input = document.getElementById("text");

function add(text, type) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerHTML = `<div class="bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

async function send() {
    const text = input.value.trim();
    if (!text) return;

    add(text, "user");
    input.value = "";

    add("در حال نوشتن…", "bot");

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ chatInput: text })
        });

        const raw = await res.text();
        messages.lastChild.remove();

        let reply = raw;

        try {
            const json = JSON.parse(raw);
            if (json.reply) reply = json.reply;
        } catch {}

        add(reply, "bot");

    } catch (e) {
        messages.lastChild.remove();
        add("❌ اتصال برقرار نشد", "bot");
        console.error(e);
    }
}

