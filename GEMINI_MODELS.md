# 🤖 Hướng dẫn chọn Gemini Model

## So sánh Gemini 2.5 Flash vs Pro

### 📊 Bảng so sánh

| Tiêu chí | Gemini 2.5 Flash | Gemini 2.5 Pro |
|----------|------------------|----------------|
| **Tốc độ** | ⚡ Nhanh nhất | 🐢 Chậm hơn (~2-3x) |
| **Chi phí** | 💰 Rẻ nhất | 💎 Đắt hơn (~4x) |
| **Chất lượng** | ✅ Tốt cho hầu hết task | 🌟 Xuất sắc cho task phức tạp |
| **Multimodal** | ✅ Văn bản, ảnh, video, âm thanh | ✅ Văn bản, ảnh, video, âm thanh |
| **Context Window** | 1M tokens | 2M tokens |
| **Rate Limit (Free)** | 15 requests/phút | 10 requests/phút |
| **Thinking Mode** | Có thể tắt để tăng tốc | Luôn bật (mặc định) |

### 🎯 Khi nào dùng Gemini 2.5 Flash?

✅ **Phù hợp cho:**
- Chat thông thường, hỏi đáp nhanh
- Xử lý hình ảnh đơn giản (OCR, nhận diện object)
- Tóm tắt văn bản, dịch thuật
- Phân tích dữ liệu cơ bản
- Trích xuất thông tin từ ảnh chụp màn hình
- **Hầu hết các task trong ứng dụng này**

💡 **Ưu điểm:**
- Phản hồi nhanh (1-2 giây)
- Tiết kiệm chi phí
- Đủ thông minh cho 80-90% task hàng ngày

### 🎓 Khi nào dùng Gemini 2.5 Pro?

✅ **Phù hợp cho:**
- Phân tích phức tạp, suy luận logic (math, coding)
- Viết content dài, sáng tạo cao
- Phân tích video chi tiết
- Xử lý nhiều hình ảnh cùng lúc
- Task yêu cầu độ chính xác cao
- Reasoning tasks (giải toán, lập luận)

💡 **Ưu điểm:**
- Chất lượng output tốt nhất
- Hiểu ngữ cảnh sâu hơn
- Xử lý task phức tạp tốt hơn

### 📌 Gợi ý cho ứng dụng này

**Dùng Gemini 2.5 Flash khi:**
- ✅ Nhận diện thông tin tài khoản từ ảnh
- ✅ Chat thường ngày, hỏi đáp
- ✅ Thêm/sửa/xóa dữ liệu
- ✅ Thống kê đơn giản

**Dùng Gemini 2.5 Pro khi:**
- ✅ Phân tích xu hướng bán hàng phức tạp
- ✅ Dự đoán doanh thu, lập kế hoạch
- ✅ Xử lý ảnh chất lượng thấp/mờ
- ✅ Trích xuất thông tin từ nhiều ảnh

### 💰 Chi phí (Tham khảo)

#### Free Tier (Miễn phí):
- **Flash**: 15 requests/phút, 1500/ngày
- **Pro**: 10 requests/phút, 50/ngày

#### Paid Tier:
- **Flash**: $0.075/1M input tokens, $0.30/1M output tokens
- **Pro**: $1.25/1M input tokens, $5.00/1M output tokens

👉 **Gợi ý**: Bắt đầu với **Flash** cho hầu hết task, chỉ chuyển sang **Pro** khi thực sự cần!

### 🔧 Cách chuyển đổi model

1. Vào phần **"Cài đặt AI"**
2. Chọn **"Google Gemini"** làm AI Provider
3. Dropdown **"Chọn Gemini Model"** sẽ xuất hiện
4. Chọn model phù hợp:
   - `Gemini 2.5 Flash` (mặc định)
   - `Gemini 2.5 Pro` (nâng cao)
5. Nhấn **"Lưu API Key"**

### 🧪 Test thử

**Test với Flash:**
```
Bạn: "Phân tích ảnh này và cho tôi biết có bao nhiêu tài khoản"
AI: [Phản hồi trong 1-2 giây] ✅
```

**Test với Pro:**
```
Bạn: "Phân tích 5 ảnh này, tìm pattern chung và dự đoán giá trị trung bình"
AI: [Phản hồi trong 3-5 giây, chi tiết hơn] ✅
```

### 📚 Tài liệu tham khảo

- [Gemini Models Documentation](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Thinking Mode Guide](https://ai.google.dev/gemini-api/docs/thinking)

---

**Lưu ý**: Cả hai model đều hỗ trợ đầy đủ multimodal (văn bản, hình ảnh, video, âm thanh). Sự khác biệt chính là **tốc độ** và **chất lượng reasoning**.
