// Database structure
let database = {
    accounts: [],
    customers: [],
    transactions: []
};

let currentImage = null;
let apiKey = localStorage.getItem('ai_api_key') || '';
let aiProvider = localStorage.getItem('ai_provider') || 'groq'; // groq or gemini
let useCloudStorage = localStorage.getItem('use_cloud_storage') === 'true';
let spreadsheetId = localStorage.getItem('spreadsheet_id') || '1L-iggbSlUwE6Z83GBHdOPLaTn9IpqaQoaHgzBKyhPVU';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDatabase();
    updateStats();
    if (apiKey) {
        document.getElementById('apiKey').value = apiKey;
    }
    if (spreadsheetId) {
        document.getElementById('spreadsheetId').value = spreadsheetId;
    }
    // Set AI provider
    document.getElementById('aiProvider').value = aiProvider;
    updateStorageStatus();
    updateAIProviderInfo();
});

// Database functions
async function loadDatabase() {
    if (useCloudStorage && spreadsheetId && apiKey) {
        try {
            await loadFromGoogleSheets();
            addMessage('✅ Đã tải dữ liệu từ Google Sheets', 'ai');
        } catch (error) {
            console.error('Failed to load from Google Sheets:', error);
            // Fallback to local
            const saved = localStorage.getItem('accountDatabase');
            if (saved) {
                database = JSON.parse(saved);
            }
        }
    } else {
        const saved = localStorage.getItem('accountDatabase');
        if (saved) {
            database = JSON.parse(saved);
        }
    }
}

async function saveDatabase() {
    // Always save to local as backup
    localStorage.setItem('accountDatabase', JSON.stringify(database));
    
    // Save to cloud if enabled
    if (useCloudStorage && spreadsheetId && apiKey) {
        try {
            await saveToGoogleSheets();
        } catch (error) {
            console.error('Failed to save to Google Sheets:', error);
        }
    }
    updateStats();
}

// Google Sheets functions
async function loadFromGoogleSheets() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:Z1000?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load from Google Sheets');
    
    const data = await response.json();
    if (data.values && data.values.length > 1) {
        // Parse data from sheets (skip header row)
        database.accounts = [];
        database.customers = [];
        database.transactions = [];
        
        for (let i = 1; i < data.values.length; i++) {
            const row = data.values[i];
            if (row[0] === 'account') {
                database.accounts.push(JSON.parse(row[1]));
            } else if (row[0] === 'customer') {
                database.customers.push(JSON.parse(row[1]));
            } else if (row[0] === 'transaction') {
                database.transactions.push(JSON.parse(row[1]));
            }
        }
    }
}

async function saveToGoogleSheets() {
    // Prepare data
    const values = [['Type', 'Data']];
    
    database.accounts.forEach(acc => {
        values.push(['account', JSON.stringify(acc)]);
    });
    database.customers.forEach(cust => {
        values.push(['customer', JSON.stringify(cust)]);
    });
    database.transactions.forEach(trans => {
        values.push(['transaction', JSON.stringify(trans)]);
    });
    
    // Note: This requires OAuth2 for write access
    // For now, we'll show instructions to user
    addMessage('💡 Để lưu lên Google Sheets, bạn cần:\n1. Tạo Google Sheet\n2. Chia sẻ với email service account\n3. Hoặc dùng Google Apps Script', 'ai');
}

function updateStats() {
    const totalAccounts = database.accounts.length;
    const soldAccounts = database.accounts.filter(acc => acc.sold).length;
    const paidAccounts = database.transactions.filter(t => t.paid).length;
    const unpaidAccounts = database.transactions.filter(t => !t.paid).length;

    document.getElementById('totalAccounts').textContent = totalAccounts;
    document.getElementById('soldAccounts').textContent = soldAccounts;
    document.getElementById('paidAccounts').textContent = paidAccounts;
    document.getElementById('unpaidAccounts').textContent = unpaidAccounts;
}

// API Key management
function saveApiKey() {
    const key = document.getElementById('apiKey').value.trim();
    const provider = document.getElementById('aiProvider').value;
    
    if (key) {
        localStorage.setItem('ai_api_key', key);
        localStorage.setItem('ai_provider', provider);
        apiKey = key;
        aiProvider = provider;
        addMessage(`✅ Đã lưu ${provider.toUpperCase()} API Key thành công!`, 'ai');
        updateAIProviderInfo();
    } else {
        alert('Vui lòng nhập API Key!');
    }
}

function updateAIProviderInfo() {
    const infoEl = document.getElementById('aiProviderInfo');
    const provider = document.getElementById('aiProvider').value;
    
    if (provider === 'groq') {
        infoEl.innerHTML = `
            <strong>🚀 Groq - Siêu nhanh & Miễn phí</strong><br>
            Model: Llama 3.3 (70B) / Llama 3.2 Vision (90B)<br>
            Speed: ~500 tokens/giây<br>
            Limit: 14,400 requests/ngày<br>
            <a href="https://console.groq.com/keys" target="_blank">Lấy API key tại đây</a>
        `;
    } else {
        infoEl.innerHTML = `
            <strong>🔷 Google Gemini</strong><br>
            Model: Gemini 1.5 Flash<br>
            Limit: 15 requests/phút<br>
            <a href="https://aistudio.google.com/app/apikey" target="_blank">Lấy API key tại đây</a>
        `;
    }
}

function saveSpreadsheetId() {
    const id = document.getElementById('spreadsheetId').value.trim();
    if (id) {
        localStorage.setItem('spreadsheet_id', id);
        spreadsheetId = id;
        addMessage('✅ Đã lưu Google Sheets ID!', 'ai');
    } else {
        alert('Vui lòng nhập Spreadsheet ID!');
    }
}

function toggleCloudStorage() {
    useCloudStorage = !useCloudStorage;
    localStorage.setItem('use_cloud_storage', useCloudStorage.toString());
    updateStorageStatus();
    if (useCloudStorage) {
        addMessage('🌥️ Đã bật lưu trữ đám mây. Dữ liệu sẽ đồng bộ với Google Sheets.', 'ai');
    } else {
        addMessage('💾 Đã tắt lưu trữ đám mây. Dữ liệu chỉ lưu local.', 'ai');
    }
}

function updateStorageStatus() {
    const statusEl = document.getElementById('storageStatus');
    if (statusEl) {
        if (useCloudStorage && spreadsheetId) {
            statusEl.textContent = '🌥️ Cloud (Google Sheets)';
            statusEl.style.color = '#27ae60';
        } else {
            statusEl.textContent = '💾 Local Storage';
            statusEl.style.color = '#95a5a6';
        }
    }
}

// Chat functions
function addMessage(content, type = 'user', imageUrl = null) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    let messageHTML = '<div class="message-content">';
    if (type === 'ai') {
        messageHTML += '<strong>AI Assistant:</strong>';
    } else {
        messageHTML += '<strong>Bạn:</strong>';
    }
    
    if (imageUrl) {
        messageHTML += `<img src="${imageUrl}" alt="Uploaded image">`;
    }
    
    messageHTML += `<p>${content}</p></div>`;
    messageDiv.innerHTML = messageHTML;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearChat() {
    const chatContainer = document.getElementById('chatContainer');
    const messages = chatContainer.querySelectorAll('.message');
    messages.forEach((msg, index) => {
        if (index > 0) { // Keep first welcome message
            msg.remove();
        }
    });
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message && !currentImage) {
        return;
    }

    if (!apiKey) {
        alert('Vui lòng nhập Gemini API Key trong phần cài đặt!');
        return;
    }

    // Add user message
    if (currentImage) {
        addMessage(message || 'Đã gửi ảnh', 'user', currentImage);
    } else {
        addMessage(message, 'user');
    }

    input.value = '';
    
    // Process message
    await processWithAI(message, currentImage);
    
    // Clear image
    if (currentImage) {
        removeImage();
    }
}

async function processWithAI(message, imageData) {
    try {
        // Create system prompt with database context
        const systemPrompt = `Bạn là trợ lý AI quản lý tài khoản. Dữ liệu hiện tại:
        
Tài khoản: ${JSON.stringify(database.accounts, null, 2)}
Khách hàng: ${JSON.stringify(database.customers, null, 2)}
Giao dịch: ${JSON.stringify(database.transactions, null, 2)}

Nhiệm vụ của bạn:
1. Phân tích yêu cầu của người dùng
2. Thêm/cập nhật/xóa dữ liệu khi cần
3. Trả lời câu hỏi về tài khoản, khách hàng, thanh toán
4. Phân tích dữ liệu và đưa ra lời khuyên
5. Nếu có ảnh, trích xuất thông tin tài khoản từ ảnh

Khi phát hiện thông tin mới, hãy trả về JSON với format:
{
    "action": "add_account" | "add_customer" | "add_transaction" | "update" | "response",
    "data": {...},
    "message": "Phản hồi cho người dùng"
}`;

        let aiResponse;
        
        if (aiProvider === 'groq') {
            aiResponse = await callGroqAPI(systemPrompt, message, imageData);
        } else {
            aiResponse = await callGeminiAPI(systemPrompt, message, imageData);
        }
        
        // Try to parse as JSON for actions
        try {
            const parsed = JSON.parse(aiResponse);
            if (parsed.action) {
                handleAIAction(parsed);
                return;
            }
        } catch (e) {
            // Not JSON, just display response
        }
        
        // Process response for special commands
        processUserCommand(message, aiResponse);
        
        addMessage(aiResponse, 'ai');
        
    } catch (error) {
        console.error('AI Error:', error);
        addMessage(`Lỗi kết nối với AI (${aiProvider.toUpperCase()}). Vui lòng kiểm tra API Key và thử lại. Chi tiết: ${error.message}`, 'ai');
    }
}

async function callGroqAPI(systemPrompt, userMessage, imageData) {
    const messages = [
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: userMessage
        }
    ];
    
    // Use latest Groq models (updated December 2025)
    let model = "llama-3.3-70b-versatile"; // Latest fast model (replaces 3.1)
    
    if (imageData) {
        model = "llama-3.2-90b-vision-preview"; // Latest vision model
        messages[1].content = [
            { type: "text", text: userMessage },
            { type: "image_url", image_url: { url: imageData } }
        ];
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGeminiAPI(systemPrompt, userMessage, imageData) {
    let requestBody;
    
    if (imageData) {
        // Vision API call
        const base64Image = imageData.split(',')[1];
        requestBody = {
            contents: [{
                parts: [
                    { text: systemPrompt + "\n\nYêu cầu: " + userMessage },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image
                        }
                    }
                ]
            }]
        };
    } else {
        // Text only
        requestBody = {
            contents: [{
                parts: [{ text: systemPrompt + "\n\nYêu cầu: " + userMessage }]
            }]
        };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error('Gemini API request failed: ' + response.statusText);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function handleAIAction(action) {
    switch (action.action) {
        case 'add_account':
            database.accounts.push({
                id: Date.now(),
                ...action.data,
                createdAt: new Date().toISOString()
            });
            saveDatabase();
            addMessage(action.message || 'Đã thêm tài khoản thành công!', 'ai');
            break;
            
        case 'add_customer':
            database.customers.push({
                id: Date.now(),
                ...action.data,
                createdAt: new Date().toISOString()
            });
            saveDatabase();
            addMessage(action.message || 'Đã thêm khách hàng thành công!', 'ai');
            break;
            
        case 'add_transaction':
            database.transactions.push({
                id: Date.now(),
                ...action.data,
                createdAt: new Date().toISOString()
            });
            saveDatabase();
            addMessage(action.message || 'Đã thêm giao dịch thành công!', 'ai');
            break;
            
        default:
            addMessage(action.message || 'Đã xử lý yêu cầu', 'ai');
    }
}

function processUserCommand(message, aiResponse) {
    const lowerMessage = message.toLowerCase();
    
    // Auto-detect account additions
    if (lowerMessage.includes('thêm tài khoản') || lowerMessage.includes('tài khoản mới')) {
        const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
        const priceMatch = message.match(/(\d+)k/i);
        
        if (emailMatch) {
            database.accounts.push({
                id: Date.now(),
                email: emailMatch[0],
                price: priceMatch ? parseInt(priceMatch[1]) * 1000 : 0,
                sold: false,
                createdAt: new Date().toISOString()
            });
            saveDatabase();
        }
    }
    
    // Auto-detect customer additions
    if (lowerMessage.includes('bán cho') || lowerMessage.includes('khách')) {
        const platformMatch = message.match(/(zalo|telegram|facebook|fb|tele|zl)/i);
        const nameMatch = message.match(/(?:zalo|telegram|facebook|fb|tele|zl)[:\s]+([^,\n]+)/i);
        
        if (nameMatch) {
            database.customers.push({
                id: Date.now(),
                name: nameMatch[1].trim(),
                platform: platformMatch ? platformMatch[1] : 'unknown',
                createdAt: new Date().toISOString()
            });
            saveDatabase();
        }
    }
    
    // Auto-detect payment updates
    if (lowerMessage.includes('thanh toán') || lowerMessage.includes('đã trả')) {
        // Mark recent transaction as paid
        if (database.transactions.length > 0) {
            const lastTransaction = database.transactions[database.transactions.length - 1];
            lastTransaction.paid = true;
            lastTransaction.paidAt = new Date().toISOString();
            saveDatabase();
        }
    }
}

// Image handling
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImage = e.target.result;
            document.getElementById('previewImg').src = currentImage;
            document.getElementById('imagePreview').style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    currentImage = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageInput').value = '';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Quick actions
function showAllAccounts() {
    if (database.accounts.length === 0) {
        addMessage('Chưa có tài khoản nào trong hệ thống.', 'ai');
        return;
    }
    
    let html = '<table><tr><th>Email</th><th>Giá</th><th>Trạng thái</th><th>Ngày tạo</th></tr>';
    database.accounts.forEach(acc => {
        html += `<tr>
            <td>${acc.email || acc.account || 'N/A'}</td>
            <td>${acc.price ? acc.price.toLocaleString() + 'đ' : 'N/A'}</td>
            <td>${acc.sold ? '✅ Đã bán' : '⏳ Chưa bán'}</td>
            <td>${new Date(acc.createdAt).toLocaleDateString('vi-VN')}</td>
        </tr>`;
    });
    html += '</table>';
    
    addMessage(html, 'ai');
}

function showUnpaidCustomers() {
    const unpaid = database.transactions.filter(t => !t.paid);
    
    if (unpaid.length === 0) {
        addMessage('Tất cả khách hàng đã thanh toán! 🎉', 'ai');
        return;
    }
    
    let html = '<strong>Danh sách chưa thanh toán:</strong><ul>';
    unpaid.forEach(t => {
        const customer = database.customers.find(c => c.id === t.customerId);
        html += `<li>${customer ? customer.name : 'Unknown'} - ${t.amount ? t.amount.toLocaleString() + 'đ' : 'N/A'}</li>`;
    });
    html += '</ul>';
    
    addMessage(html, 'ai');
}

function exportData() {
    const dataStr = JSON.stringify(database, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `account-data-${Date.now()}.json`;
    link.click();
    
    addMessage('Đã xuất dữ liệu thành công!', 'ai');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                database = JSON.parse(event.target.result);
                saveDatabase();
                addMessage('Đã nhập dữ liệu thành công!', 'ai');
            } catch (error) {
                addMessage('Lỗi: File không đúng định dạng!', 'ai');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function showCloudSetupGuide() {
    const guide = `
<strong>📖 Hướng dẫn setup Google Sheets làm Database 24/7:</strong>

<h4>Phương án 1: Dùng Google Sheets (Đơn giản nhất)</h4>
<ol>
    <li><strong>Tạo Google Sheet mới:</strong>
        <ul>
            <li>Vào <a href="https://sheets.google.com" target="_blank">Google Sheets</a></li>
            <li>Tạo sheet mới tên "AccountDatabase"</li>
            <li>Copy Spreadsheet ID từ URL (phần giữa /d/ và /edit)</li>
            <li>Ví dụ: <code>docs.google.com/spreadsheets/d/<strong>ABC123xyz</strong>/edit</code></li>
        </ul>
    </li>
    <li><strong>Chia sẻ công khai:</strong>
        <ul>
            <li>Click "Share" > "Anyone with link can <strong>view</strong>"</li>
            <li>Chỉ cần quyền VIEW để đọc dữ liệu</li>
        </ul>
    </li>
    <li><strong>Dán Sheet ID vào ô trên và bật Cloud Storage</strong></li>
</ol>

<h4>Phương án 2: Dùng GitHub Gist (Miễn phí 100%)</h4>
<p>Tôi có thể nâng cấp để dùng GitHub Gist - lưu dữ liệu dạng JSON file trên GitHub của bạn, hoạt động 24/7!</p>

<h4>Phương án 3: Firebase (Realtime Database)</h4>
<p>Firebase cung cấp Realtime Database miễn phí với giới hạn 1GB. Tốt nhất cho ứng dụng thời gian thực.</p>

<strong>Bạn muốn dùng phương án nào?</strong>
    `;
    
    addMessage(guide, 'ai');
}
