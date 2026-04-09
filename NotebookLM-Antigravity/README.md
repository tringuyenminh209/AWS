Máy chủ MCP NotebookLM cho Antigravity


Một máy chủ MCP cho NotebookLM (notebooklm.google.com).

Lưu ý: Đã thử nghiệm với tài khoản Pro/miễn phí. Có thể hoạt động với tài khoản NotebookLM Enterprise nhưng chưa được kiểm tra.

📺 Xem Demo

Tổng quan chung
Antigravity Desktop
Perplexity Desktop
MCP Super Assistant





Tính năng
Công cụ
Mô tả
notebook_list
Liệt kê tất cả các notebook
notebook_create
Tạo một notebook mới
notebook_get
Lấy chi tiết notebook cùng với các nguồn
notebook_describe
Lấy tóm tắt do AI tạo về nội dung notebook
source_describe
Lấy tóm tắt do AI tạo và từ khóa cho một nguồn
source_get_content
Lấy nội dung văn bản thô từ nguồn (không qua xử lý AI)
notebook_rename
Đổi tên notebook
chat_configure
Cấu hình mục tiêu/phong cách trò chuyện và độ dài phản hồi
notebook_delete
Xóa notebook (yêu cầu xác nhận)
notebook_add_url
Thêm URL/YouTube làm nguồn
notebook_add_text
Thêm văn bản dán làm nguồn
notebook_add_drive
Thêm tài liệu Google Drive làm nguồn
notebook_query
Đặt câu hỏi và nhận câu trả lời từ AI
source_list_drive
Liệt kê các nguồn với trạng thái mới nhất
source_sync_drive
Đồng bộ các nguồn Drive cũ (yêu cầu xác nhận)
source_delete
Xóa một nguồn khỏi notebook (yêu cầu xác nhận)
research_start
Bắt đầu nghiên cứu Web hoặc Drive để khám phá nguồn
research_status
Kiểm tra tiến độ nghiên cứu với thời gian chờ tích hợp
research_import
Nhập các nguồn đã khám phá vào notebook
audio_overview_create
Tạo podcast âm thanh (yêu cầu xác nhận)
video_overview_create
Tạo tổng quan video (yêu cầu xác nhận)
infographic_create
Tạo infographic (yêu cầu xác nhận)
slide_deck_create
Tạo bộ slide thuyết trình (yêu cầu xác nhận)
studio_status
Kiểm tra trạng thái tạo artifact studio
studio_delete
Xóa artifact studio (yêu cầu xác nhận)
refresh_auth
Tải lại token xác thực từ ổ đĩa hoặc chạy xác thực lại không đầu (headless)
save_auth_tokens
Lưu cookie để xác thực

Cảnh báo quan trọng
MCP này sử dụng các API nội bộ mà:

Không được ghi chép và có thể thay đổi mà không báo trước
Yêu cầu trích xuất cookie từ trình duyệt của bạn (Tôi có một công cụ cho việc đó!)

Sử dụng với rủi ro của riêng bạn cho mục đích cá nhân/thử nghiệm.
Cài đặt
Cài đặt từ PyPI sử dụng trình quản lý gói Python ưa thích của bạn:
Sử dụng uv (Được khuyến nghị cho Antigravity)
uv tool install notebooklm-mcp-server
Sử dụng pip
pip install notebooklm-mcp-server
Sử dụng pipx
pipx install notebooklm-mcp-server

Thay thế: Cài đặt từ Mã nguồn # Clone kho lưu trữ

git clone https://github.com/jacob-bd/notebooklm-mcp.git

cd notebooklm-mcp

# Cài đặt với uv

uv tool install .
Nâng cấp
# Sử dụng uv

uv tool upgrade notebooklm-mcp-server

# Sử dụng pip

pip install --upgrade notebooklm-mcp-server

# Sử dụng pipx

pipx upgrade notebooklm-mcp-server

Sau khi nâng cấp, khởi động lại công cụ AI của bạn để kết nối lại với máy chủ MCP đã cập nhật:

Antigravity Code: Khởi động lại ứng dụng, hoặc sử dụng /mcp để kết nối lại
Cursor: Khởi động lại ứng dụng
Gemini CLI: Khởi động lại phiên CLI
Gỡ cài đặt
Để loại bỏ hoàn toàn MCP:

# Sử dụng uv

uv tool uninstall notebooklm-mcp-server

# Sử dụng pip

pip uninstall notebooklm-mcp-server

# Sử dụng pipx

pipx uninstall notebooklm-mcp-server

# Xóa các token xác thực đã lưu vào cache (tùy chọn)

rm -rf ~/.notebooklm-mcp

Cũng loại bỏ khỏi các công cụ AI của bạn:

Công cụ
Lệnh
Antigravity Code
antigravity mcp remove notebooklm-mcp
Gemini CLI
gemini mcp remove notebooklm-mcp
Cursor/VS Code
Xóa mục nhập từ ~/.cursor/mcp.json hoặc ~/.vscode/mcp.json

Xác thực
Trước khi sử dụng MCP, bạn cần xác thực với NotebookLM. Chạy:

# Khuyên dùng: Chế độ tự động (mở Chrome, bạn đăng nhập)

notebooklm-mcp-auth

# Thay thế: Chế độ File (trích xuất cookie thủ công)

notebooklm-mcp-auth --file

Chế độ tự động khởi chạy một hồ sơ Chrome chuyên dụng, bạn đăng nhập vào Google, và cookie được trích xuất tự động. Đăng nhập của bạn được lưu lại cho các lần làm mới xác thực trong tương lai.

Chế độ File hiển thị hướng dẫn để trích xuất cookie thủ công từ Chrome DevTools và lưu chúng vào một tệp.

Sau khi xác thực thành công, thêm MCP vào công cụ AI của bạn và khởi động lại.

Để biết hướng dẫn chi tiết, khắc phục sự cố và cách hệ thống xác thực hoạt động, xem docs/AUTHENTICATION.md.
Cấu hình MCP
⚠️ Cảnh báo Cửa sổ Ngữ cảnh (Context Window): MCP này cung cấp 31 công cụ tiêu thụ một phần đáng kể cửa sổ ngữ cảnh của bạn. Khuyên bạn nên tắt MCP khi không tích cực sử dụng NotebookLM để bảo toàn ngữ cảnh cho công việc khác của bạn. Trong Antigravity Code, sử dụng @notebooklm-mcp để bật/tắt, hoặc sử dụng lệnh /mcp.
Tùy chọn CLI
Bạn có thể cấu hình máy chủ bằng các đối số dòng lệnh:

Cờ
Mô tả
Mặc định
--transport, -t
Giao thức truyền tải (stdio, http, sse)
stdio
--port, -p
Cổng cho truyền tải HTTP/SSE
8000
--host, -H
Host để bind cho HTTP/SSE
127.0.0.1
--debug
Bật ghi log chi tiết (yêu cầu/phản hồi API)
False
--query-timeout
Thời gian chờ cho truy vấn tính bằng giây
120.0

Biến môi trường
Thay vào đó, sử dụng các biến môi trường:

Biến
Mô tả
NOTEBOOKLM_MCP_TRANSPORT
Loại truyền tải (stdio, http, sse)
NOTEBOOKLM_MCP_PORT
Cổng để lắng nghe
NOTEBOOKLM_MCP_HOST
Host để bind
NOTEBOOKLM_MCP_DEBUG
true để bật ghi log debug
NOTEBOOKLM_QUERY_TIMEOUT
Thời gian chờ truy vấn tính bằng giây

Hỗ trợ HTTP (Open WebUI)
Chạy như một máy chủ HTTP cho truy cập từ xa hoặc thiết lập nhiều người dùng:

notebooklm-mcp --transport http --port 8000

Xem docs/MULTI_USER_ANALYSIS.md để biết hướng dẫn triển khai nhiều người dùng chi tiết.
Antigravity Code (Phương pháp CLI được khuyến nghị)
Sử dụng lệnh CLI tích hợp để thêm máy chủ MCP:

Thêm cho tất cả dự án (khuyên dùng):

antigravity mcp add --scope user notebooklm-mcp notebooklm-mcp

Hoặc chỉ thêm cho dự án hiện tại:

antigravity mcp add notebooklm-mcp notebooklm-mcp

Vậy là xong! Khởi động lại Antigravity Code để sử dụng các công cụ MCP.

Xác minh cài đặt:

antigravity mcp list

Thay thế: Cấu hình JSON thủ công Nếu bạn thích chỉnh sửa tệp cấu hình thủ công, thêm vào ~/.antigravity.json:

{

  "mcpServers": {

    "notebooklm-mcp": {

      "command": "notebooklm-mcp"

    }

  }

}

Khởi động lại Antigravity Code sau khi chỉnh sửa.
Cursor, VS Code, Antigravity Desktop & Các IDE khác
Đối với các công cụ sử dụng tệp cấu hình JSON:

Công cụ
Vị trí tệp cấu hình
Cursor
~/.cursor/mcp.json
VS Code
~/.vscode/mcp.json
Antigravity Desktop
~/Library/Application Support/Antigravity/antigravity_desktop_config.json (macOS)


Bước 1: Tìm đường dẫn đã cài đặt của bạn:

which notebooklm-mcp

Điều này thường trả về /Users/<TÊN_NGƯỜI_DÙNG>/.local/bin/notebooklm-mcp trên macOS.

Bước 2: Thêm cấu hình này (thay thế đường dẫn với kết quả từ Bước 1):

{

  "mcpServers": {

    "notebooklm-mcp": {

      "command": "/Users/<TÊN_NGƯỜI_DÙNG>/.local/bin/notebooklm-mcp"

    }

  }

}

Khởi động lại ứng dụng sau khi thêm cấu hình.
Các công cụ tương thích MCP khác
Công cụ CLI với lệnh MCP tích hợp (AIDER, Codex, OpenCode, v.v.):

<công-cụ-của-bạn> mcp add notebooklm-mcp notebooklm-mcp

Công cụ sử dụng tệp cấu hình JSON — sử dụng phương pháp đường dẫn đầy đủ như trên.
Gemini CLI (Phương pháp CLI được khuyến nghị)
Sử dụng lệnh CLI tích hợp để thêm máy chủ MCP:

Thêm cho tất cả dự án (khuyên dùng):

gemini mcp add --scope user notebooklm-mcp notebooklm-mcp

Hoặc chỉ thêm cho dự án hiện tại:

gemini mcp add notebooklm-mcp notebooklm-mcp

Vậy là xong! Khởi động lại Gemini CLI để sử dụng các công cụ MCP.

Xác minh cài đặt:

gemini mcp list

Thay thế: Cấu hình JSON thủ công Thêm vào ~/.gemini/settings.json dưới mcpServers (chạy which notebooklm-mcp để tìm đường dẫn của bạn):

"notebooklm-mcp": {

  "command": "/Users/<TÊN_NGƯỜI_DÙNG>/.local/bin/notebooklm-mcp"

}

Khởi động lại Gemini CLI sau khi chỉnh sửa.
Quản lý sử dụng Cửa sổ Ngữ cảnh
Vì MCP này có 31 công cụ, nên tắt nó khi không sử dụng:

Antigravity Code:

# Bật/tắt bằng cách @-đề cập trong cuộc trò chuyện

@notebooklm-mcp

# Hoặc sử dụng lệnh /mcp để bật/tắt

/mcp

Cursor/Gemini CLI:

Comment lại server trong tệp cấu hình của bạn khi không cần thiết
Hoặc sử dụng tính năng quản lý MCP của công cụ nếu có
Những gì bạn có thể làm
Chỉ cần trò chuyện với công cụ AI của bạn (Antigravity Code, Cursor, Gemini CLI) bằng ngôn ngữ tự nhiên. Dưới đây là một số ví dụ:
Nghiên cứu & Khám phá
"Liệt kê tất cả các notebook NotebookLM của tôi"
"Tạo một notebook mới tên là 'Nghiên cứu Chiến lược AI'"
"Bắt đầu nghiên cứu web về 'chỉ số ROI của AI doanh nghiệp' và chỉ cho tôi những nguồn nó tìm thấy"
"Thực hiện nghiên cứu sâu về 'xu hướng thị trường đám mây' và nhập 10 nguồn hàng đầu"
"Tìm kiếm Google Drive của tôi các tài liệu về 'lộ trình sản phẩm' và tạo một notebook"
Thêm nội dung
"Thêm URL này vào notebook của tôi: https://example.com/article"
"Thêm video YouTube này về Kubernetes vào notebook"
"Thêm ghi chú cuộc họp của tôi dưới dạng nguồn văn bản vào notebook này"
"Nhập Google Doc này vào notebook nghiên cứu của tôi"
Phân tích hỗ trợ bởi AI
"Những phát hiện chính trong notebook này là gì?"
"Tóm tắt các luận điểm chính qua tất cả các nguồn này"
"Nguồn này nói gì về các thực tiễn bảo mật tốt nhất?"
"Lấy tóm tắt AI về nội dung của notebook này"
"Cấu hình cuộc trò chuyện để sử dụng phong cách hướng dẫn học tập với phản hồi dài hơn"
Tạo nội dung
"Tạo một bản tổng quan podcast âm thanh của notebook này theo định dạng chuyên sâu"
"Tạo video giải thích với phong cách hình ảnh cổ điển"
"Tạo tài liệu tóm tắt từ các nguồn này"
"Tạo thẻ ghi nhớ (flashcards) để học, độ khó trung bình"
"Tạo một infographic theo hướng ngang"
"Xây dựng sơ đồ tư duy từ các nguồn nghiên cứu của tôi"
"Tạo bộ slide thuyết trình từ notebook này"
Quản lý thông minh
"Kiểm tra xem nguồn Google Drive nào đã lỗi thời và đồng bộ chúng"
"Hiển thị cho tôi tất cả các nguồn trong notebook này với trạng thái mới nhất của chúng"
"Xóa nguồn này khỏi notebook"
"Kiểm tra trạng thái tạo tổng quan âm thanh của tôi"

Mẹo chuyên nghiệp: Sau khi tạo nội dung studio (âm thanh, video, báo cáo, v.v.), hãy kiểm tra (poll) trạng thái để lấy URL tải xuống khi quá trình tạo hoàn tất.
Vòng đời Xác thực
Thành phần
Thời lượng
Làm mới
Cookies
~2-4 tuần
Tự động làm mới qua Chrome headless (nếu hồ sơ đã lưu)
CSRF Token
~phút
Tự động làm mới khi mỗi yêu cầu thất bại
Session ID
Mỗi phiên MCP
Tự động trích xuất khi khởi động MCP


v0.1.9+: Máy chủ hiện tự động xử lý hết hạn token:

Làm mới token CSRF ngay lập tức khi hết hạn
Tải lại cookie từ đĩa nếu được cập nhật bên ngoài
Chạy xác thực Chrome headless nếu hồ sơ có thông tin đăng nhập đã lưu

Bạn cũng có thể gọi refresh_auth() để tải lại token một cách rõ ràng.

Nếu làm mới tự động thất bại (đăng nhập Google hết hạn hoàn toàn), hãy chạy lại notebooklm-mcp-auth.
Khắc phục sự cố
uv tool upgrade Không cài đặt phiên bản mới nhất
Triệu chứng:

Chạy uv tool upgrade notebooklm-mcp-server cài đặt phiên bản cũ hơn (ví dụ: 0.1.5 thay vì 0.1.9)
uv cache clean không khắc phục được vấn đề

Tại sao điều này xảy ra: uv tool upgrade tôn trọng các ràng buộc phiên bản từ lần cài đặt ban đầu của bạn. Nếu bạn ban đầu đã cài đặt một phiên bản cũ hơn hoặc với một ràng buộc, upgrade sẽ nằm trong các giới hạn đó theo thiết kế.

Khắc phục — Buộc cài đặt lại:

uv tool install --force notebooklm-mcp-server

Điều này bỏ qua bất kỳ ràng buộc nào được lưu trong bộ nhớ cache và cài đặt phiên bản mới nhất tuyệt đối từ PyPI.

Xác minh:

uv tool list | grep notebooklm

# Nên hiển thị: notebooklm-mcp-server v0.1.9 (hoặc mới nhất)


Chrome DevTools MCP Không hoạt động (Cursor/Gemini CLI)
Nếu Chrome DevTools MCP hiển thị "không có công cụ, lời nhắc hoặc tài nguyên" hoặc không khởi động được, có thể do lỗi npx đã biết với mô-đun puppeteer-core.

Triệu chứng:

Cursor/Gemini CLI hiển thị MCP đã kết nối nhưng với "Không có công cụ, lời nhắc hoặc tài nguyên"
Lỗi sinh tiến trình (spawn errors) trong log: spawn pnpx ENOENT hoặc lỗi không tìm thấy mô-đun
Không thể trích xuất cookie cho xác thực NotebookLM

Khắc phục:

Cài đặt pnpm (nếu chưa cài đặt):

npm install -g pnpm

Cập nhật cấu hình Chrome DevTools MCP:

Cho Cursor (~/.cursor/mcp.json):

"chrome-devtools": {

  "command": "pnpm",

  "args": ["dlx", "chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]

}

Cho Gemini CLI (~/.gemini/settings.json):

"chrome-devtools": {

  "command": "pnpm",

  "args": ["dlx", "chrome-devtools-mcp@latest"]

}

Khởi động lại IDE/CLI của bạn để thay đổi có hiệu lực.

Tại sao điều này xảy ra: Chrome DevTools MCP sử dụng puppeteer-core đã thay đổi đường dẫn mô-đun trong v23+, nhưng hành vi lưu trữ cache của npx gây ra lỗi phân giải mô-đun. Sử dụng pnpm dlx tránh được vấn đề này.

Các vấn đề liên quan:

ChromeDevTools/chrome-devtools-mcp#160
ChromeDevTools/chrome-devtools-mcp#111
ChromeDevTools/chrome-devtools-mcp#221
Hạn chế
Giới hạn tốc độ: Gói miễn phí có ~50 truy vấn/ngày
Không có hỗ trợ chính thức: API có thể thay đổi mà không báo trước
Hết hạn cookie: Cần trích xuất lại cookie mỗi vài tuần
Đóng góp
Xem ANTIGRAVITY.md để biết tài liệu API chi tiết và cách thêm tính năng mới.
Cảnh báo Vibe Coding
Minh bạch hoàn toàn: dự án này được xây dựng bởi một người không phải lập trình viên sử dụng trợ lý mã hóa AI. Nếu bạn là một nhà phát triển Python có kinh nghiệm, bạn có thể nhìn vào codebase này và nhăn mặt. Điều đó không sao cả.

Mục tiêu ở đây là giải quyết nhu cầu - truy cập lập trình vào NotebookLM - và học hỏi trong quá trình đó. Mã hoạt động, nhưng có thể thiếu các mẫu thiết kế, tối ưu hóa hoặc sự tinh tế mà chỉ có nhiều năm kinh nghiệm mới cung cấp được.

Đây là nơi bạn tham gia. Nếu bạn thấy điều gì đó khiến bạn khó chịu, hãy xem xét đóng góp thay vì chỉ đóng tab. Đây là mã nguồn mở đặc biệt vì chuyên môn của con người là không thể thay thế. Cho dù đó là tái cấu trúc (refactoring), xử lý lỗi tốt hơn, gợi ý kiểu (type hints), hay hướng dẫn kiến trúc - PR và issues đều được hoan nghênh.

Hãy nghĩ về nó như một cơ hội để hướng dẫn một nhà phát triển được hỗ trợ bởi AI thông qua đánh giá mã. Tất cả chúng ta đều hưởng lợi khi các nhà phát triển có kinh nghiệm chia sẻ kiến thức của họ.
Tín dụng
Lời cảm ơn đặc biệt đến:

Le Anh Tuan (@latuannetnam) vì đã đóng góp phương thức truyền tải HTTP, hệ thống ghi log debug và tối ưu hóa hiệu suất.
David Szabo-Pele (@davidszp) cho công cụ source_get_content và các sửa lỗi xác thực Linux.
Giấy phép
Giấy phép MIT

