GEMINI.md
Tổng quan Dự án
Máy chủ MCP NotebookLM

Dự án này triển khai một máy chủ Model Context Protocol (MCP) cung cấp quyền truy cập lập trình vào NotebookLM. Nó cho phép các tác nhân AI và nhà phát triển tương tác với các notebook, nguồn và khả năng truy vấn của NotebookLM.

Đã thử nghiệm với tài khoản cá nhân/miễn phí. Có thể hoạt động với tài khoản Google Workspace nhưng chưa được kiểm tra. Dự án này dựa vào các API nội bộ (batchexecute RPCs).
Môi trường & Thiết lập
Dự án sử dụng uv để quản lý sự phụ thuộc và cài đặt công cụ.
Điều kiện tiên quyết
Python 3.11+
uv (Trình quản lý gói Python Universal)
Google Chrome (để xác thực tự động)
Cài đặt
Từ PyPI (Được khuyến nghị):

uv tool install notebooklm-mcp-server

# hoặc: pip install notebooklm-mcp-server

Từ Mã nguồn (Phát triển):

git clone https://github.com/YOUR_USERNAME/notebooklm-mcp.git

cd notebooklm-mcp

uv tool install .
Xác thực
Ưu tiên: Chạy CLI xác thực tự động:

notebooklm-mcp-auth

Điều này khởi chạy Chrome, bạn đăng nhập, và cookie được trích xuất tự động. Đăng nhập của bạn được lưu vào một hồ sơ Chrome để sử dụng trong tương lai.

Tự động làm mới (v0.1.9+): Máy chủ hiện tự động xử lý hết hạn token:

Làm mới token CSRF khi hết hạn (ngay lập tức)
Tải lại cookie từ đĩa nếu được cập nhật bên ngoài
Chạy xác thực Chrome headless nếu hồ sơ có thông tin đăng nhập đã lưu

Nếu xác thực headless thất bại (đăng nhập Google hết hạn hoàn toàn), bạn sẽ thấy thông báo chạy lại notebooklm-mcp-auth.

Làm mới rõ ràng (công cụ MCP):

refresh_auth()  # Tải lại token từ đĩa hoặc chạy xác thực headless

Dự phòng: Trích xuất thủ công (nếu CLI thất bại) Nếu công cụ tự động không hoạt động, hãy trích xuất cookie qua Chrome DevTools:

Mở Chrome DevTools trên notebooklm.google.com
Đi đến tab Network, tìm một yêu cầu batchexecute
Sao chép header Cookie và gọi save_auth_tokens(cookies=...)

Biến môi trường (nâng cao):

export NOTEBOOKLM_COOKIES="SID=xxx; HSID=xxx; SSID=xxx; ..."

Cookies tồn tại trong vài tuần. Máy chủ tự động làm mới miễn là đăng nhập hồ sơ Chrome còn hiệu lực.
Quy trình Phát triển
Xây dựng và Chạy
Cài đặt lại sau khi thay đổi: Vì uv tool install cài đặt vào một môi trường cô lập, bạn phải cài đặt lại để xem các thay đổi trong quá trình phát triển.

uv cache clean

uv tool install --force .

Chạy Máy chủ: Chạy Máy chủ:

# Chế độ tiêu chuẩn (stdio)

notebooklm-mcp

# Chế độ Debug (ghi log chi tiết)

notebooklm-mcp --debug

# Chế độ Máy chủ HTTP

notebooklm-mcp --transport http --port 8000
Kiểm thử
Chạy bộ kiểm thử sử dụng pytest qua uv:

# Chạy tất cả các kiểm thử

uv run pytest

# Chạy một tệp kiểm thử cụ thể

uv run pytest tests/test_api_client.py
Cấu trúc Dự án
src/notebooklm_mcp/
server.py: Điểm vào chính. Định nghĩa máy chủ MCP và các công cụ.
api_client.py: Logic cốt lõi. Chứa các cuộc gọi API nội bộ.
constants.py: Nguồn sự thật duy nhất cho tất cả các ánh xạ mã-tên API.
auth.py: Xử lý xác thực, lưu trữ và tải token.
auth_cli.py: Triển khai của CLI notebooklm-mcp-auth.
ANTIGRAVITY.md: Chứa tài liệu chi tiết về các ID RPC nội bộ và giao thức cụ thể. Tham khảo tệp này để tìm hiểu sâu về API.
pyproject.toml: Cấu hình dự án và các phụ thuộc.
Các quy ước chính
API nội bộ: Dự án này dựa vào các API không được ghi chép. Những thay đổi đối với API nội bộ của Google sẽ phá vỡ chức năng.
Giao thức RPC: API sử dụng giao thức batchexecute của Google. Các phản hồi thường chứa các tiền tố "anti-XSSI" ()]}') cần phải được loại bỏ.
Công cụ: Các tính năng mới nên được hiển thị dưới dạng công cụ MCP trong server.py.
Hằng số: Tất cả các ánh xạ mã-tên nên được định nghĩa trong constants.py sử dụng lớp CodeMapper.

