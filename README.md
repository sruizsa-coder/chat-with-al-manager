# 💬 AI Account Manager

Ứng dụng quản lý tài khoản thông minh sử dụng AI - Hỗ trợ chat và nhận diện hình ảnh

## 🌟 Tính năng

- ✅ **Chat với AI**: Trò chuyện tự nhiên để quản lý tài khoản
- 📸 **Nhận diện hình ảnh**: Chụp màn hình và AI tự động trích xuất thông tin
- 👥 **Quản lý khách hàng**: Theo dõi khách từ Zalo, Telegram, Facebook
- 💰 **Theo dõi thanh toán**: Kiểm tra ai đã thanh toán, ai chưa
- 📊 **Thống kê & Phân tích**: AI phân tích dữ liệu và đưa ra lời khuyên
- 💾 **Lưu trữ dữ liệu**: Dữ liệu được lưu trên trình duyệt, có thể xuất/nhập

## 🚀 Cách sử dụng

### 1. Lấy API Key miễn phí

#### Tùy chọn A: Groq (Khuyên dùng - Nhanh nhất)
1. Truy cập: https://console.groq.com/keys
2. Đăng nhập (miễn phí)
3. Tạo API Key mới
4. Copy API Key
5. **Ưu điểm**: Nhanh gấp 5-10 lần Gemini, 14,400 requests/ngày

#### Tùy chọn B: Google Gemini
1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập với Google
3. Tạo API Key mới
4. Copy API Key

### 2. Cài đặt ứng dụng

#### Cách 1: Dùng trực tiếp trên GitHub Pages

Ứng dụng sẽ được deploy tại: `https://sruizsa-coder.github.io/chat-with-al-manager/`

#### Cách 2: Chạy trên máy local

```bash
# Clone repository
git clone https://github.com/sruizsa-coder/chat-with-al-manager.git
Chọn AI Provider (Groq hoặc Gemini)
3. Nhập API Key vào phần "Cài đặt AI" và nhấn "Lưu"
4 Mở file index.html bằng trình duyệt
# Hoặc dùng Live Server trong VS Code
```

### 3. Sử dụng

1. Mở ứng dụng trong trình duyệt
2. Nhập API Key vào phần "Cài đặt API" và nhấn "Lưu"
3. Bắt đầu chat với AI!

## 💡 Ví dụ sử dụng

### Thêm tài khoản
```
Thêm tài khoản satinuryani@madrasah.kemenag.go.id giá 50k
```

### Thêm khách hàng
```
Bán cho khách Zalo: Nguyễn Văn A
```

### Cập nhật thanh toán
```
Khách A đã thanh toán
```

### Xem thống kê
```
Thống kê tài khoản tháng này
```

### Gửi ảnh
- Click nút 📎 để đính kèm ảnh màn hình
- AI sẽ tự động nhận diện thông tin tài khoản

## 🏗️ Cấu trúc dự án

```
chat-with-al-manager/
├── index.html          # Giao diện chính
├── styles.css          # Style và UI
├── app.js              # Logic ứng dụng và AI
└── README.md           # Hướng dẫn
```

## 🔧 Công nghệ

- **Frontend**
  - Groq (Llama 3.1/3.2 Vision) - Khuyên dùng
  - Google Gemini 1.5 Flash
- **Database**: 
  - LocalStorage (lưu trên trình duyệt)
  - Google Sheets (tùy chọn, cloud sync
- **Database**: LocalStorage (lưu trên trình duyệt)
- **Hosting**: GitHub Pages

##**Groq miễn phí**: 14,400 requests/ngày, ~500 tokens/giây
- **Gemini miễn phí**

- API Key được lưu trên trình duyệt của bạn (an toàn)
- Dữ liệu được lưu local, không gửi lên server
- Có thể xuất dữ liệu ra file JSON để backup
- Gemini API miễn phí có giới hạn: 15 requests/phút

## 🎯 Tính năng nâng cao

Ứng dụng tự động:
- Phát hiện email trong tin nhắn và thêm vào database
- Nhận diện thông tin khách hàng (Zalo, Telegram, Facebook)
- Cập nhật trạng thái thanh toán
- Phân tích xu hướng bán hàng
- Đưa ra lời khuyên quản lý

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo Pull Request hoặc Issues.

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 👨‍💻 Tác giả

Created with ❤️ by AI Assistant

---

**Lưu ý**: Đây là ứng dụng miễn phí, không thu thập dữ liệu người dùng. Mọi thông tin được lưu trữ local trên máy bạn.
