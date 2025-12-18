// Database structure
let database = {
    accounts: [],
    customers: [],
    transactions: []
};

let currentImage = null;
let apiKey = localStorage.getItem('gemini_api_key') || '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDatabase();
    updateStats();
    if (apiKey) {
        document.getElementById('apiKey').value = apiKey;
    }
});

// Database functions
function loadDatabase() {
    const saved = localStorage.getItem('accountDatabase');
    if (saved) {
        database = JSON.parse(saved);
    }
}

function saveDatabase() {
    localStorage.setItem('accountDatabase', JSON.stringify(database));
    updateStats();
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
    if (key) {
        localStorage.setItem('gemini_api_key', key);
        apiKey = key;
        addMessage('Đã lưu API Key thành công!', 'ai');
    } else {
        alert('Vui lòng nhập API Key!');
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

        let requestBody;
        
        if (imageData) {
            // Vision API call
            const base64Image = imageData.split(',')[1];
            requestBody = {
                contents: [{
                    parts: [
                        { text: systemPrompt + "\n\nYêu cầu: " + message },
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
                    parts: [{ text: systemPrompt + "\n\nYêu cầu: " + message }]
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
            throw new Error('API request failed: ' + response.statusText);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
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
        addMessage('Lỗi kết nối với AI. Vui lòng kiểm tra API Key và thử lại. Chi tiết: ' + error.message, 'ai');
    }
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
