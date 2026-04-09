Tham khảo Nhanh - Các tính năng Giai đoạn 1
Truyền tải HTTP
# Khởi động máy chủ HTTP trên localhost:8000

notebooklm-mcp --transport http

# Host và cổng tùy chỉnh

notebooklm-mcp -t http -H 0.0.0.0 -p 3000

# Với chế độ không trạng thái (cho cân bằng tải)

notebooklm-mcp --transport http --stateless

# Phương pháp biến môi trường

export NOTEBOOKLM_MCP_TRANSPORT=http

export NOTEBOOKLM_MCP_PORT=9000

notebooklm-mcp

Các Endpoint khi chạy HTTP:

Endpoint MCP: http://localhost:8000/mcp
Kiểm tra sức khỏe (Health Check): http://localhost:8000/health
Ghi log Debug
# Bật ghi log debug qua CLI

notebooklm-mcp --debug

# Bật ghi log debug qua môi trường

export NOTEBOOKLM_MCP_DEBUG=true

notebooklm-mcp

# Debug + truyền tải HTTP

notebooklm-mcp --transport http --debug

Những gì được ghi log:

Tên cuộc gọi RPC và URL
Nội dung yêu cầu (đã cắt bớt)
Mã trạng thái phản hồi và nội dung (đã cắt bớt)
Kết quả trích xuất (đã cắt bớt)
Tất cả các Cờ (Flags)
notebooklm-mcp
--transport, -t   stdio|http|sse (mặc định: stdio)

--host, -H        Host để bind (mặc định: 127.0.0.1)

--port, -p        Số cổng (mặc định: 8000)

--path            Đường dẫn endpoint MCP (mặc định: /mcp)

--stateless       Bật chế độ không trạng thái

--debug           Bật ghi log debug
notebooklm-mcp-auth
--file [PATH]       Nhập cookie từ tệp

--port PORT         Cổng Chrome DevTools (mặc định: 9222)

--show-tokens       Hiển thị token đã lưu trong bộ nhớ đệm

--no-auto-launch    Không tự động khởi chạy Chrome
Biến môi trường
NOTEBOOKLM_MCP_TRANSPORT=http|sse|stdio

NOTEBOOKLM_MCP_HOST=0.0.0.0

NOTEBOOKLM_MCP_PORT=8000

NOTEBOOKLM_MCP_PATH=/mcp

NOTEBOOKLM_MCP_STATELESS=true

NOTEBOOKLM_MCP_DEBUG=true
Kiểm thử
# Kiểm thử trợ giúp

notebooklm-mcp --help

notebooklm-mcp-auth --help

# Khởi động máy chủ HTTP

notebooklm-mcp --transport http

# Trong một terminal khác:

curl http://localhost:8000/health

# Mong đợi: {"status":"healthy","service":"notebooklm-mcp","version":"0.1.8"}

# Kiểm thử ghi log debug

notebooklm-mcp --transport http --debug

# Nên thấy: "Debug logging: ENABLED"

# Sau đó là các log chi tiết cho mỗi cuộc gọi API

