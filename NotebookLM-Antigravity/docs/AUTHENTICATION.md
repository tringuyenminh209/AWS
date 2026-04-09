Hướng dẫn Xác thực
Hướng dẫn này giải thích cách xác thực với NotebookLM MCP.
Tổng quan
NotebookLM MCP sử dụng cookie trình duyệt để xác thực (không có API chính thức). Công cụ CLI notebooklm-mcp-auth trích xuất các cookie này và lưu trữ chúng vào bộ nhớ đệm để máy chủ MCP sử dụng.

Có sẵn hai phương pháp xác thực:

Phương pháp
Tốt nhất cho
Yêu cầu
Chế độ Tự động (mặc định)
Hầu hết người dùng
Đã cài Chrome, có thể đóng Chrome
Chế độ File (--file)
Thiết lập phức tạp, khắc phục sự cố
Trích xuất cookie thủ công



Phương pháp 1: Chế độ Tự động (Được khuyến nghị)
Phương pháp này khởi chạy Chrome tự động và trích xuất cookie sau khi bạn đăng nhập.
Điều kiện tiên quyết
Google Chrome đã được cài đặt
Chrome phải được đóng hoàn toàn trước khi chạy
Các bước
# 1. Đóng Chrome hoàn toàn (Cmd+Q trên Mac, hoặc thoát từ thanh tác vụ)

# 2. Chạy lệnh xác thực

notebooklm-mcp-auth

# 3. Đăng nhập vào tài khoản Google của bạn trong cửa sổ trình duyệt mở ra

# 4. Đợi thông báo "SUCCESS!"
Điều gì xảy ra đằng sau
Một hồ sơ Chrome chuyên dụng được tạo tại ~/.notebooklm-mcp/chrome-profile/
Chrome khởi chạy với chế độ gỡ lỗi từ xa được bật
Bạn đăng nhập vào NotebookLM qua trình duyệt
Cookies và token CSRF được trích xuất và lưu vào cache
Chrome có thể được đóng lại
Đăng nhập liên tục
Hồ sơ Chrome chuyên dụng này duy trì đăng nhập Google của bạn:

Lần chạy đầu tiên: Bạn phải đăng nhập vào Google
Các lần chạy sau: Đã đăng nhập, chỉ trích xuất cookie mới

Hồ sơ này tách biệt với hồ sơ Chrome thông thường của bạn và không bao gồm tiện ích mở rộng nào.


Phương pháp 2: Chế độ File
Phương pháp này cho phép bạn trích xuất và cung cấp cookie thủ công. Sử dụng cách này nếu:

Chế độ tự động không hoạt động trên hệ thống của bạn
Bạn có các tiện ích mở rộng Chrome gây cản trở (ví dụ: Google Antigravity IDE)
Bạn thích kiểm soát thủ công
Các bước
# Tùy chọn A: Chế độ tương tác (hiển thị hướng dẫn, nhắc nhập đường dẫn tệp)

notebooklm-mcp-auth --file

# Tùy chọn B: Đường dẫn tệp trực tiếp

notebooklm-mcp-auth --file /path/to/cookies.txt
Cách trích xuất Cookie thủ công
Mở Chrome và đi đến https://notebooklm.google.com
Đảm bảo bạn đã đăng nhập
Nhấn F12 (hoặc Cmd+Option+I trên Mac) để mở DevTools
Nhấp vào tab Network
Trong hộp lọc, gõ: batchexecute
Nhấp vào bất kỳ notebook nào để kích hoạt yêu cầu
Nhấp vào một yêu cầu batchexecute trong danh sách
Trong bảng điều khiển bên phải, cuộn đến Request Headers
Tìm dòng bắt đầu bằng cookie:
Nhấp chuột phải vào giá trị cookie và chọn Copy value
Dán vào một tệp văn bản và lưu lại
Định dạng Tệp Cookie
Tệp cookie phải chứa chuỗi cookie thô từ Chrome DevTools:

SID=abc123...; HSID=xyz789...; SSID=...; APISID=...; SAPISID=...; __Secure-1PSID=...; ...

Lưu ý:

Các dòng bắt đầu bằng # được coi là nhận xét và bị bỏ qua
Tệp có thể chứa chuỗi cookie trên một hoặc nhiều dòng
Một tệp mẫu cookies.txt được bao gồm trong kho lưu trữ


Nơi Token được lưu trữ
Các token xác thực được lưu trong bộ nhớ đệm tại:

~/.notebooklm-mcp/auth.json

Tệp này chứa:

Cookies đã phân tích cú pháp
Token CSRF (tự động trích xuất)
Session ID (tự động trích xuất)
Dấu thời gian trích xuất

Hồ sơ Chrome chuyên dụng (cho chế độ tự động) được lưu trữ tại:

~/.notebooklm-mcp/chrome-profile/


Sau khi Xác thực
Sau khi xác thực, thêm MCP vào công cụ AI của bạn:

Antigravity Code:

antigravity mcp add notebooklm-mcp -- notebooklm-mcp

Gemini CLI:

gemini mcp add notebooklm notebooklm-mcp

Thủ công (settings.json):

{

  "mcpServers": {

    "notebooklm-mcp": {

      "command": "notebooklm-mcp"

    }

  }

}

Sau đó khởi động lại trợ lý AI của bạn.


Hết hạn Token
Cookies: Thường ổn định trong vài tuần, nhưng một số xoay vòng mỗi yêu cầu
CSRF token: Tự động làm mới mỗi khi khởi tạo client MCP
Session ID: Tự động làm mới mỗi khi khởi tạo client MCP

Khi bạn bắt đầu thấy lỗi xác thực, chỉ cần chạy lại notebooklm-mcp-auth để làm mới.


Khắc phục sự cố
"Chrome is running but without remote debugging enabled"
Đóng Chrome hoàn toàn và thử lại. Trên Mac, sử dụng Cmd+Q để thoát hoàn toàn.
Chế độ tự động không kết nối được
Thử chế độ file thay thế:

notebooklm-mcp-auth --file
Lỗi "401 Unauthorized" hoặc "403 Forbidden"
Cookie của bạn đã hết hạn. Chạy lại lệnh xác thực để làm mới.
Chrome mở ra với thương hiệu lạ (ví dụ: Antigravity IDE)
Một số tiện ích mở rộng Chrome hoặc công cụ sửa đổi hành vi của Chrome. Sử dụng chế độ file:

notebooklm-mcp-auth --file
Tệp cookie hiển thị "missing required cookies"
Đảm bảo bạn đã sao chép giá trị cookie, không phải tên header. Giá trị nên bắt đầu bằng thứ gì đó như SID=... chứ không phải cookie: SID=....


Tương thích Chrome 136+
Chrome phiên bản 136 trở lên hạn chế gỡ lỗi từ xa trên hồ sơ mặc định vì lý do bảo mật. MCP này giải quyết vấn đề bằng cách:

Sử dụng một thư mục hồ sơ chuyên dụng (~/.notebooklm-mcp/chrome-profile/)
Thêm cờ --remote-allow-origins=* cho các kết nối WebSocket

Điều này được xử lý tự động - không yêu cầu hành động từ người dùng.


Ghi chú Bảo mật
Cookies được lưu trữ cục bộ trong ~/.notebooklm-mcp/auth.json
Hồ sơ Chrome chuyên dụng chứa đăng nhập Google của bạn cho NotebookLM
Không bao giờ chia sẻ tệp auth.json của bạn hoặc commit nó vào kiểm soát phiên bản
Tệp cookies.txt trong repo là một mẫu - đừng commit cookie thật

