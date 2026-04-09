ANTIGRAVITY.md
Tệp này cung cấp hướng dẫn cho Antigravity (Antigravity Code) khi làm việc với mã trong kho lưu trữ này.
Tổng quan Dự án
Máy chủ MCP NotebookLM - Cung cấp quyền truy cập lập trình vào NotebookLM (notebooklm.google.com) bằng cách sử dụng các API nội bộ.

Đã thử nghiệm với tài khoản cá nhân/miễn phí. Có thể hoạt động với tài khoản Google Workspace nhưng chưa được kiểm tra.
Các lệnh phát triển
# Cài đặt các phụ thuộc

uv tool install .

# Cài đặt lại sau khi thay đổi mã (LUÔN dọn dẹp cache trước)

uv cache clean && uv tool install --force .

# Chạy máy chủ MCP (stdio)

notebooklm-mcp

# Chạy với ghi log Debug

notebooklm-mcp --debug

# Chạy như máy chủ HTTP

notebooklm-mcp --transport http --port 8000

# Chạy kiểm thử

uv run pytest

# Chạy một kiểm thử đơn lẻ

uv run pytest tests/test_file.py::test_function -v

Yêu cầu Python: >=3.11
Xác thực (ĐƠN GIẢN HÓA!)
Bạn chỉ cần cung cấp COOKIES! Token CSRF và Session ID hiện được trích xuất tự động khi cần thiết.
Phương pháp 1: Chrome DevTools MCP (Được khuyến nghị)
Tùy chọn A - Nhanh (Khuyên dùng): Trích xuất token CSRF và session ID trực tiếp từ yêu cầu mạng - không cần tải trang!

# 1. Điều hướng đến trang NotebookLM

navigate_page(url="https://notebooklm.google.com/")

# 2. Lấy một yêu cầu batchexecute (bất kỳ cuộc gọi API NotebookLM nào)

get_network_request(reqid=<bất_kỳ_request_batchexecute_nào>)

# 3. Lưu với cả ba trường từ yêu cầu mạng:

save_auth_tokens(

    cookies=<cookie_header>,

    request_body=<request_body>,  # Chứa token CSRF

    request_url=<request_url>      # Chứa session ID

)

Tùy chọn B - Tối thiểu (cuộc gọi đầu tiên chậm hơn): Chỉ lưu cookie, các token được trích xuất từ trang trong cuộc gọi API đầu tiên.

save_auth_tokens(cookies=<cookie_header>)
Phương pháp 2: Biến môi trường
Biến
Bắt buộc
Mô tả
NOTEBOOKLM_COOKIES
Có
Header cookie đầy đủ từ Chrome DevTools
NOTEBOOKLM_CSRF_TOKEN
Không
(KHÔNG CÒN DÙNG - trích xuất tự động)
NOTEBOOKLM_SESSION_ID
Không
(KHÔNG CÒN DÙNG - trích xuất tự động)

Hết hạn Token
Cookies: Ổn định trong vài tuần, nhưng một số xoay vòng (rotate) mỗi yêu cầu
CSRF token: Tự động làm mới mỗi khi khởi tạo client
Session ID: Tự động làm mới mỗi khi khởi tạo client

Khi các cuộc gọi API thất bại với lỗi xác thực, hãy trích xuất lại cookie mới từ Chrome DevTools.
Kiến trúc
src/notebooklm_mcp/

├── __init__.py      # Phiên bản gói

├── server.py        # Máy chủ FastMCP với các định nghĩa công cụ

├── api_client.py    # Client API nội bộ

├── constants.py     # Ánh xạ mã-tên (lớp CodeMapper)

├── auth.py          # Lưu trữ cache và xác thực token

└── auth_cli.py      # CLI cho xác thực dựa trên Chrome (notebooklm-mcp-auth)

Các tệp thực thi:

notebooklm-mcp - Máy chủ MCP
notebooklm-mcp-auth - CLI để trích xuất token (yêu cầu đóng Chrome)
Các công cụ MCP được cung cấp
Công cụ
Mục đích
notebook_list
Liệt kê tất cả các notebook
notebook_create
Tạo notebook mới
notebook_get
Lấy chi tiết notebook
notebook_describe
Lấy tóm tắt do AI tạo về nội dung notebook với các từ khóa
source_describe
Lấy tóm tắt do AI tạo và chip từ khóa cho một nguồn
source_get_content
Lấy nội dung văn bản thô từ nguồn (không qua xử lý AI)
notebook_rename
Đổi tên notebook
chat_configure
Cấu hình mục tiêu/phong cách trò chuyện và độ dài phản hồi
notebook_delete
Xóa notebook (YÊU CẦU xác nhận)
notebook_add_url
Thêm nguồn URL/YouTube
notebook_add_text
Thêm nguồn văn bản dán
notebook_add_drive
Thêm nguồn Google Drive
notebook_query
Đặt câu hỏi (AI trả lời!)
source_list_drive
Liệt kê các nguồn với loại, kiểm tra độ mới của Drive
source_sync_drive
Đồng bộ các nguồn Drive cũ (YÊU CẦU xác nhận)
source_delete
Xóa một nguồn khỏi notebook (YÊU CẦU xác nhận)
research_start
Bắt đầu nghiên cứu Web hoặc Drive để khám phá nguồn
research_status
Kiểm tra tiến độ nghiên cứu và nhận kết quả
research_import
Nhập các nguồn đã khám phá vào notebook
audio_overview_create
Tạo podcast âm thanh (YÊU CẦU xác nhận)
video_overview_create
Tạo tổng quan video (YÊU CẦU xác nhận)
infographic_create
Tạo infographic (YÊU CẦU xác nhận)
slide_deck_create
Tạo bộ slide thuyết trình (YÊU CẦU xác nhận)
report_create
Tạo báo cáo - Briefing Doc, Study Guide, Blog Post, Custom (YÊU CẦU xác nhận)
flashcards_create
Tạo thẻ ghi nhớ với các tùy chọn độ khó (YÊU CẦU xác nhận)
quiz_create
Tạo các bài kiểm tra tương tác (YÊU CẦU xác nhận)
data_table_create
Tạo bảng dữ liệu từ các nguồn (YÊU CẦU xác nhận)
mind_map_create
Tạo và lưu sơ đồ tư duy (YÊU CẦU xác nhận)
studio_status
Kiểm tra trạng thái tạo artifact studio
studio_delete
Xóa artifact studio (YÊU CẦU xác nhận)
save_auth_tokens
Lưu token đã trích xuất qua Chrome DevTools MCP


QUAN TRỌNG - Các hoạt động yêu cầu xác nhận:

notebook_delete yêu cầu confirm=True - việc xóa là KHÔNG THỂ HOÀN TÁC
source_delete yêu cầu confirm=True - việc xóa là KHÔNG THỂ HOÀN TÁC
source_sync_drive yêu cầu confirm=True - luôn hiển thị các nguồn cũ trước qua source_list_drive
Tất cả các công cụ tạo studio yêu cầu confirm=True - hiển thị cài đặt và nhận phê duyệt của người dùng trước
studio_delete yêu cầu confirm=True - liệt kê các artifact trước qua studio_status, việc xóa là KHÔNG THỂ HOÀN TÁC
Các tính năng CHƯA được triển khai
Notes - Lưu phản hồi trò chuyện dưới dạng ghi chú
Share notebook - Các tính năng cộng tác
Export - Tải xuống nội dung
Khắc phục sự cố
"401 Unauthorized" hoặc "403 Forbidden"
Cookies hoặc token CSRF đã hết hạn
Trích xuất lại từ Chrome DevTools
"Invalid CSRF token"
Giá trị at= đã hết hạn
Phải khớp với phiên hiện tại
Danh sách notebook trống
Phiên có thể dành cho một tài khoản Google khác
Xác minh bạn đã đăng nhập vào đúng tài khoản
Lỗi giới hạn tốc độ (Rate limit errors)
Gói miễn phí: ~50 truy vấn/ngày
Đợi đến ngày hôm sau hoặc nâng cấp lên Plus
Tài liệu
Tham chiếu API
Để biết tài liệu API chi tiết (RPC IDs, cấu trúc tham số, định dạng phản hồi), xem:

docs/API_REFERENCE.md

Bao gồm:

Tất cả các endpoint RPC đã khám phá và tham số của chúng
Cấu trúc loại nguồn (URL, text, Drive)
Tạo nội dung Studio (âm thanh, video, báo cáo, v.v.)
Chi tiết quy trình nghiên cứu
Quy trình tạo sơ đồ tư duy
Cấu trúc metadata nguồn

Chỉ đọc API_REFERENCE.md khi:

Gỡ lỗi các vấn đề API
Thêm các tính năng mới
Hiểu hành vi API nội bộ
Kế hoạch Kiểm thử MCP
Để kiểm thử công cụ MCP toàn diện, xem:

docs/MCP_TEST_PLAN.md

Bao gồm:

Các trường hợp kiểm thử từng bước cho tất cả 31 công cụ MCP
Kiểm thử xác thực và các hoạt động cơ bản
Kiểm thử quản lý nguồn và đồng bộ Drive
Các kiểm thử tạo nội dung Studio (âm thanh, video, infographic, v.v.)
Các lời nhắc sao chép-dán nhanh để xác thực

Sử dụng kế hoạch kiểm thử này khi:

Xác thực chức năng máy chủ MCP sau khi thay đổi mã
Kiểm thử việc triển khai công cụ mới
Gỡ lỗi các vấn đề công cụ MCP
Đóng góp
Khi thêm các tính năng mới:

Sử dụng Chrome DevTools MCP để bắt yêu cầu mạng
Ghi lại RPC ID trong docs/API_REFERENCE.md
Thêm cấu trúc tham số với các chú thích
Cập nhật api_client.py với phương thức mới
Thêm công cụ tương ứng trong server.py
Cập nhật danh sách kiểm tra "Các tính năng CHƯA được triển khai"
Thêm trường hợp kiểm thử vào docs/MCP_TEST_PLAN.md
Giấy phép
Giấy phép MIT

