# UNIXサーバー構築演習 — Ôn Tập Toàn Bộ 15 Bài Học

> Nguồn: NotebookLM — Thực hành xây dựng máy chủ UNIX (Ubuntu + LAMP Stack + WordPress)

---

## Mục Lục

| # | Bài học | Chủ đề chính |
|---|---------|--------------|
| 1 | [Bài 1](#bài-1) | Lịch sử, Cài đặt, Thao tác cơ bản |
| 2 | [Bài 2](#bài-2) | Shell, Pipe, Redirection |
| 3 | [Bài 3](#bài-3) | Quản lý Tập tin |
| 4 | [Bài 4](#bài-4) | Quản lý Thư mục |
| 5 | [Bài 5](#bài-5) | Vim Editor |
| 6 | [Bài 6](#bài-6) | SSH Server |
| 7 | [Bài 7](#bài-7) | Ôn tập tổng hợp (Bài 1–6) |
| 8 | [Bài 8](#bài-8) | Shell Script cơ bản 1 |
| 9 | [Bài 9](#bài-9) | AWK & SED |
| 10 | [Bài 10](#bài-10) | Quản lý Người dùng & UFW |
| 11 | [Bài 11](#bài-11) | Quản lý Tập tin hệ thống & Prometheus |
| 12 | [Bài 12](#bài-12) | Quản lý Hệ thống & Package & FTP |
| 13 | [Bài 13](#bài-13) | Web Server 1 (Apache + PHP) |
| 14 | [Bài 14](#bài-14) | Web Server 2 (Userdir & Virtual Host) |
| 15 | [Bài 15](#bài-15) | WordPress (LAMP Stack) |
| ++ | [Nâng cao](#nâng-cao) | SSL, Samba, DNS, Mail, Log |

---

## Thiết Lập Môi Trường

### Cài đặt VirtualBox + Ubuntu

| Mục | Giá trị |
|-----|---------|
| Tên máy ảo | `UNIXSv` |
| OS | Ubuntu 24.04 LTS (64-bit) |
| RAM | 4096 MB |
| CPU | 2 cores |
| EFI | Enable |
| HDD | 20 GB (Pre-allocate Full) |
| Network Adapter 1 | NAT |
| Network Adapter 2 | Host-only Adapter |
| Ngôn ngữ cài đặt | 日本語 |
| Múi giờ | Osaka |
| Username | `クラス名+番号` (ví dụ: `ie2a99`) |
| Password | `123qwecc` |

### Sau khi cài xong

```bash
sudo apt update
sudo apt upgrade
sudo apt install -y openssh-server
sudo systemctl start ssh
sudo systemctl enable ssh
```

Kết nối từ Windows bằng **Tera Term** → địa chỉ IP của máy ảo.

---

## Bài 1

### Lịch sử, Cài đặt và Thao tác Cơ bản

**Mục tiêu:** Làm quen với Linux/Ubuntu, điều hướng thư mục, lệnh cơ bản.

### Lệnh quan trọng

| Lệnh | Chức năng |
|------|-----------|
| `sudo <lệnh>` | Chạy lệnh với quyền root |
| `shutdown -h now` | Tắt máy ngay |
| `shutdown -r now` | Khởi động lại |
| `history` | Xem lịch sử lệnh đã gõ |
| `ls` | Liệt kê file/thư mục |
| `ls -la` | Liệt kê kể cả file ẩn, chi tiết |
| `cd <đường dẫn>` | Di chuyển thư mục |
| `pwd` | Hiển thị thư mục hiện tại |
| `man <lệnh>` | Xem hướng dẫn lệnh |

### Bài tập (kad01)

```bash
# Xem lịch sử lệnh
history

# Lưu lịch sử vào file nộp bài
history > kad01.txt
```

**Nộp:** File `kad01.txt` (lịch sử lệnh đã thực hành)

---

## Bài 2

### Shell — Pipe, Redirection, Wildcard

**Mục tiêu:** Sử dụng shell bash, phím tắt, ký tự đại diện, chuyển hướng luồng, đường ống.

### Lệnh quan trọng

| Ký hiệu/Lệnh | Chức năng |
|--------------|-----------|
| `Tab` | Tự động hoàn thành |
| `*` | Ký tự đại diện (mọi ký tự) |
| `?` | Đại diện 1 ký tự |
| `which <lệnh>` | Tìm đường dẫn của lệnh |
| `cat <file>` | Hiển thị nội dung file |
| `sort <file>` | Sắp xếp dòng |
| `grep <chuỗi> <file>` | Tìm kiếm chuỗi |
| `>` | Chuyển hướng output (ghi đè) |
| `>>` | Chuyển hướng output (nối thêm) |
| `<` | Chuyển hướng input |
| `\|` | Pipe: truyền output sang lệnh kế tiếp |

### Các ví dụ thực hành

```bash
# Liệt kê tất cả file ẩn → lưu ra file
ls -la > hidden_files.txt

# Nối thêm vào file có sẵn
ls -la >> hidden_files.txt

# Pipe: sắp xếp rồi tìm những người điểm 100
sort scores.txt | grep "100"

# Tìm kiếm không phân biệt hoa/thường
grep -i "ubuntu" /etc/os-release

# Lưu lịch sử lệnh
history > kad02.txt
```

**Nộp:** File `kad02.txt`

---

## Bài 3

### Thao tác Tập tin (cp, mv, rm, touch)

**Mục tiêu:** Sao chép, di chuyển, đổi tên, xóa file.

### Lệnh quan trọng

| Lệnh | Chức năng |
|------|-----------|
| `touch <file>` | Tạo file rỗng |
| `cp <nguồn> <đích>` | Sao chép file |
| `cp -r <dir> <đích>` | Sao chép thư mục |
| `mv <nguồn> <đích>` | Di chuyển / đổi tên |
| `rm <file>` | Xóa file |
| `rm -r <dir>` | Xóa thư mục |
| `rm -i <file>` | Xóa có xác nhận (an toàn) |
| `file <file>` | Xem loại file |
| `less <file>` | Xem nội dung file theo trang |

### Bài tập (kad03)

```bash
# Tạo thư mục làm việc
mkdir kad03

# Tạo file rỗng
touch kad03/testfile.txt

# Sao chép file
cp kad03/testfile.txt kad03/backup.txt

# Đổi tên file
mv kad03/backup.txt kad03/file03.txt

# Xóa file gốc an toàn
rm -i kad03/testfile.txt

# Lưu lịch sử
history > kad03/kad03.txt
```

**Nộp:** File `kad03/kad03.txt`

---

## Bài 4

### Thao tác Thư mục — Đường dẫn tuyệt đối/tương đối

**Mục tiêu:** Hiểu cấu trúc cây thư mục Linux, dùng đường dẫn tuyệt đối và tương đối.

### Cấu trúc thư mục Linux

```
/                   ← root (gốc)
├── home/
│   └── username/   ← Home directory (~)
├── etc/            ← Cấu hình hệ thống
├── var/            ← Log, web files
├── usr/            ← Phần mềm
└── tmp/            ← File tạm
```

### Lệnh quan trọng

| Lệnh | Chức năng |
|------|-----------|
| `cd /` | Về thư mục root |
| `cd ~` | Về Home directory |
| `cd ..` | Lên thư mục cha |
| `cd -` | Quay lại thư mục trước |
| `pwd` | In đường dẫn hiện tại |
| `mkdir -p a/b/c` | Tạo thư mục lồng nhau |
| `rmdir <dir>` | Xóa thư mục rỗng |

### Bài tập (kad04)

```bash
# Dùng đường dẫn tuyệt đối để liệt kê
ls /home/username/

# Tạo và xóa thư mục test
mkdir /tmp/test_dir
rmdir /tmp/test_dir

# Tạo thư mục bài nộp
mkdir ~/kad04

# Ghi lịch sử vào thư mục đó
history > ~/kad04/kad04.txt
```

**Nộp:** File `~/kad04/kad04.txt`

---

## Bài 5

### Vim Editor

**Mục tiêu:** Cài đặt và sử dụng Vim, tạo file HTML và Shell Script.

### Cài đặt

```bash
sudo apt install -y vim
```

### Chế độ Vim

| Chế độ | Cách vào | Mô tả |
|--------|----------|-------|
| Normal mode | `Esc` | Mặc định khi mở file |
| Insert mode | `i` | Gõ nội dung |
| Visual mode | `v` | Chọn vùng văn bản |
| Command mode | `:` | Gõ lệnh |

### Lệnh Vim quan trọng

| Lệnh | Chức năng |
|------|-----------|
| `i` | Vào Insert mode (trước con trỏ) |
| `a` | Vào Insert mode (sau con trỏ) |
| `Esc` | Quay về Normal mode |
| `:w` | Lưu file |
| `:q` | Thoát |
| `:wq` | Lưu và thoát |
| `:q!` | Thoát không lưu |
| `dd` | Xóa dòng hiện tại |
| `yy` | Sao chép dòng |
| `p` | Dán |
| `/chuỗi` | Tìm kiếm |
| `:%s/cũ/mới/g` | Thay thế toàn bộ |

### Bài tập (kad05)

```bash
# 1. Tạo file văn bản
vim vim01.txt
# → Gõ nội dung, :wq để lưu

# 2. Tạo trang HTML
vim kad05a.html
```

```html
<!DOCTYPE html>
<html>
<head><title>Bài tập Vim</title></head>
<body>
  <h1>こんにちは！</h1>
  <p>Đây là trang HTML đầu tiên.</p>
</body>
</html>
```

```bash
# 3. Tạo Shell Script
vim kad05b.sh
```

```bash
#!/bin/bash
echo "Hello, UNIX World!"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
```

```bash
# Cấp quyền thực thi và chạy thử
chmod +x kad05b.sh
./kad05b.sh

# Lưu lịch sử
history > kad05.txt
```

**Nộp:** `kad05a.html`, `kad05b.sh`, `kad05.txt`

---

## Bài 6

### SSH Server — Xác thực bằng Khóa

**Mục tiêu:** Bảo mật SSH, cấm root login, xác thực bằng key pair ED25519.

### Cài đặt SSH Server

```bash
sudo apt install -y openssh-server
sudo systemctl start ssh
sudo systemctl enable ssh
sudo systemctl status ssh
```

### Cấu hình bảo mật `/etc/ssh/sshd_config`

```bash
sudo vim /etc/ssh/sshd_config
```

Các dòng cần chỉnh sửa:

```
# Đổi port (tránh brute force)
Port 1022

# Cấm root đăng nhập
PermitRootLogin no

# Cấm đăng nhập mật khẩu rỗng
PermitEmptyPasswords no

# Chỉ cho phép đăng nhập bằng Key
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
# Áp dụng cấu hình
sudo systemctl restart ssh
```

### Tạo Key Pair (từ Tera Term)

1. Trên Tera Term: **Setup → SSH KeyGenerator**
2. Chọn loại: **ED25519**
3. Generate → Lưu Private Key (`.ppk`)
4. Copy Public Key

### Đưa Public Key lên server

```bash
# Tạo thư mục .ssh
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Dán public key vào authorized_keys
vim ~/.ssh/authorized_keys
# → Paste nội dung public key vào

# Đặt quyền đúng (bắt buộc)
chmod 600 ~/.ssh/authorized_keys
```

### Kết nối bằng Key

Từ Tera Term: nhập IP → chọn Private Key file (`.ppk`) thay vì mật khẩu.

---

## Bài 7

### Ôn Tập Tổng Hợp (Bài 1–6)

**Mục tiêu:** Củng cố toàn bộ kiến thức từ bài 1 đến 6.

### Script ôn tập tổng hợp `test.sh`

```bash
vim test.sh
```

```bash
#!/bin/bash
# Script tự động tạo thư mục và copy file

# Tạo thư mục mới
mkdir -p ~/backup_test

# Copy tất cả file .txt vào thư mục backup
for file in ~/*.txt; do
    cp "$file" ~/backup_test/
    echo "Copied: $file"
done

echo "Backup hoàn tất!"
```

```bash
# Cấp quyền thực thi
chmod +x test.sh

# Chạy thử
./test.sh

# Đặt lịch tắt máy sau 3 phút
sudo shutdown +3 "Hệ thống sẽ tắt sau 3 phút"

# Hủy lịch tắt (nếu cần)
sudo shutdown -c
```

---

## Bài 8

### Shell Script Cơ bản 1 — Biến, Điều kiện, Vòng lặp, Hàm, Cron

**Mục tiêu:** Viết shell script với if/elif, for, function, regex, quản lý process, cron.

### Kiến thức nền

```bash
# Biến
name="Ubuntu"
echo "OS: $name"

# Đọc input
read -p "Nhập tên: " username
echo "Xin chào, $username"

# Tham số truyền vào script
echo "Tham số 1: $1"
echo "Tất cả tham số: $@"

# Kiểm tra file/thư mục tồn tại
if test -e filename.txt; then
    echo "File tồn tại"
fi
```

### Script 1: Hiển thị thông tin user (kad08_1.sh)

```bash
#!/bin/bash
echo "=== Thông tin hệ thống ==="
echo "User hiện tại: $(whoami)"
echo "Thư mục home: $HOME"
echo "Shell: $SHELL"
echo "Hostname: $(hostname)"
```

### Script 2: Kiểm tra Y/N (kad08_3.sh)

```bash
#!/bin/bash
read -p "Nhập y hoặc n: " answer

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    echo "OK"
elif [ "$answer" = "n" ] || [ "$answer" = "N" ]; then
    echo "NG"
else
    echo "Please input y or n."
fi
```

### Script 3: Backup file .bak (kad08_4.sh)

```bash
#!/bin/bash
# Nhận nhiều file qua tham số $@
mkdir -p bak

for file in "$@"; do
    if test -e "$file"; then
        cp "$file" "bak/${file}.bak"
        echo "Backed up: $file → bak/${file}.bak"
    else
        echo "Không tìm thấy: $file"
    fi
done
```

```bash
# Cách chạy
chmod +x kad08_4.sh
./kad08_4.sh file1.txt file2.txt file3.txt
```

### Script 4: Regex kiểm tra OS (kad08_5.sh)

```bash
#!/bin/bash
read -p "Nhập ký tự (c/u/khác): " input

if [[ "$input" =~ ^[cC]$ ]]; then
    echo "CentOS"
elif [[ "$input" =~ ^[uU]$ ]]; then
    echo "Ubuntu"
else
    echo "Red Hat"
fi
```

> **Cú pháp Regex:** `[[ $biến =~ ^[ký_tự]+$ ]]`

### Script 5: Cấu trúc Hàm (kad08_6.sh)

```bash
#!/bin/bash
# Định nghĩa hàm
greet() {
    local name=$1
    echo "Xin chào, $name!"
}

check_disk() {
    echo "=== Dung lượng đĩa ==="
    df -h
}

check_memory() {
    echo "=== Bộ nhớ RAM ==="
    free -h
}

# Gọi hàm
greet "$(whoami)"
check_disk
check_memory
```

### Quản lý Process

```bash
# Xem tất cả process
ps aux

# Xem realtime
top
htop  # (cài thêm: sudo apt install htop)

# Tìm process theo tên
ps aux | grep apache2

# Kết thúc process theo PID
kill 1234

# Kết thúc mạnh
kill -9 1234

# Xem dung lượng đĩa
df -h

# Xem RAM
free -h
```

### Cron — Lịch tự động

```bash
# Cách 1: Tạo file trong /etc/cron.d/
sudo vim /etc/cron.d/my_job
```

```
# Cú pháp: Phút Giờ Ngày Tháng Thứ User Lệnh
# Chạy mỗi 5 phút
*/5 * * * * ubuntu /bin/bash /home/ubuntu/test.sh

# Chạy lúc 2:00 AM mỗi ngày
0 2 * * * ubuntu /bin/bash /home/ubuntu/backup.sh

# Chạy mỗi thứ 2 lúc 8:00 AM
0 8 * * 1 ubuntu /bin/bash /home/ubuntu/weekly.sh
```

```bash
sudo systemctl restart cron
```

```bash
# Cách 2: dùng crontab
crontab -e     # Mở editor
crontab -l     # Xem danh sách
crontab -r     # Xóa tất cả
```

---

## Bài 9

### AWK & SED — Xử lý văn bản nâng cao

**Mục tiêu:** Trích xuất, tính toán, biến đổi văn bản bằng awk và sed.

### AWK — Xử lý theo cột

```bash
# Cú pháp cơ bản
awk '{ hành_động }' file
awk 'BEGIN{...} { hành_động } END{...}' file

# In cột 1 và cột 3
awk '{ print $1, $3 }' data.txt

# In dòng có điều kiện
awk '$3 > 100 { print $0 }' scores.txt

# Đếm số dòng
awk 'END{ print NR }' file.txt
```

### Script 1: Tính tổng dung lượng file (kad09_2.sh)

```bash
#!/bin/bash
# ls -al hiển thị dung lượng ở cột 5
ls -al | awk '
    BEGIN { print "ディレクトリの容量は" }
    { x += $5 }
    END { print x "バイト" }
'
```

### Script 2: Tính % RAM đang dùng (kad09_ram.sh)

```bash
#!/bin/bash
free | awk '
    /^Mem:/ {
        total = $2
        used = $3
        percent = (used / total) * 100
        printf "RAM使用率: %.1f%%\n", percent
    }
'
```

### SED — Tìm và thay thế

```bash
# Cú pháp cơ bản
sed 's/cũ/mới/g' file          # Thay thế, in ra màn hình
sed -i 's/cũ/mới/g' file       # Thay thế trực tiếp trong file
sed -e 's/cũ/mới/g' file > out  # Lưu ra file mới

# Xóa dòng trống
sed '/^$/d' file.txt

# In dòng từ 3 đến 5
sed -n '3,5p' file.txt
```

### Script 3: Xóa dấu gạch ngang số điện thoại (kad09_3.sh)

```bash
#!/bin/bash
# Dữ liệu phone.dat: 090-1234-5678
# Kết quả: 09012345678

# Hiển thị ra màn hình
sed -e 's/-//g' phone.dat

# Lưu ra file mới
sed -e 's/-//g' phone.dat > phone2.dat

echo "Xong! Kết quả lưu vào phone2.dat"
```

### Script 4: Trích xuất IP từ domain (kad09_4.sh)

```bash
#!/bin/bash
read -p "Nhập URL (Enter = www.yahoo.co.jp): " url

if [ "$url" = "" ]; then
    url="www.yahoo.co.jp"
fi

echo "IP của $url:"
# nslookup trả về nhiều dòng "Address:", lọc bỏ dòng có "#" (DNS server)
nslookup "$url" | awk '/Address/ && !/#/ { print $2 }'
```

### NTPsec — Đồng bộ thời gian

```bash
sudo apt install -y ntpsec

# Kiểm tra trạng thái đồng bộ
ntpq -p

# Xem thời gian hiện tại
timedatectl
```

---

## Bài 10

### Quản lý Người dùng & Tường lửa UFW

**Mục tiêu:** Tạo/xóa user, group, phân quyền, cấu hình UFW.

### Quản lý User

```bash
# Tạo user mới (có home directory)
sudo adduser unix10

# Xóa user (và home directory)
sudo userdel -r unix10

# Đổi mật khẩu
sudo passwd unix10

# Xem danh sách user
cat /etc/passwd

# Xem file mật khẩu (hash)
sudo cat /etc/shadow
```

### Quản lý Group

```bash
# Tạo group mới
sudo addgroup unix

# Thêm user vào group
sudo usermod -aG unix unix10

# Thêm user vào group sudo (cấp quyền admin)
sudo usermod -aG sudo unix10

# Xem user thuộc group nào
groups unix10

# Xem tất cả group
cat /etc/group
```

### Phân quyền

```bash
# Xem quyền
ls -la

# chmod theo số
chmod 755 file    # rwxr-xr-x
chmod 644 file    # rw-r--r--
chmod 600 file    # rw-------

# chmod theo ký tự
chmod +x script.sh       # Thêm quyền thực thi
chmod u+w,g-w file       # User thêm write, Group bỏ write

# Đổi chủ sở hữu
sudo chown user:group file
sudo chown -R www-data:www-data /var/www/html
```

### Quyền chmod — Bảng tham chiếu

| Số | Quyền | Ký hiệu |
|----|-------|---------|
| 7 | Read+Write+Execute | `rwx` |
| 6 | Read+Write | `rw-` |
| 5 | Read+Execute | `r-x` |
| 4 | Read only | `r--` |
| 0 | No permission | `---` |

### UFW — Tường lửa

```bash
# Bật UFW
sudo ufw enable

# Xem trạng thái
sudo ufw status verbose

# Cho phép port
sudo ufw allow 22          # SSH
sudo ufw allow 1022        # SSH custom port
sudo ufw allow 80          # HTTP
sudo ufw allow 443         # HTTPS
sudo ufw allow 53          # DNS
sudo ufw allow 21          # FTP

# Chặn port
sudo ufw deny 23

# Xóa rule
sudo ufw delete allow 80

# Tắt UFW
sudo ufw disable
```

---

## Bài 11

### Quản lý Tập tin Hệ thống & Prometheus

**Mục tiêu:** Format và mount ổ đĩa mới, cài đặt Prometheus monitoring.

### Quản lý Phân vùng

```bash
# Xem ổ đĩa hiện tại
lsblk
fdisk -l

# Phân vùng ổ đĩa mới /dev/sdb (ảo 1GB)
sudo fdisk /dev/sdb
# → n (new) → p (primary) → 1 → Enter → Enter → w (write)

# Format ext4
sudo mkfs.ext4 /dev/sdb1

# Tạo mount point
sudo mkdir -p /mnt/dstore

# Mount tạm thời
sudo mount /dev/sdb1 /mnt/dstore

# Kiểm tra
df -h

# Tạo file trên đĩa mới
sudo touch /mnt/dstore/testfile.txt

# Umount
sudo umount /mnt/dstore
```

### Mount tự động khi khởi động (`/etc/fstab`)

```bash
sudo vim /etc/fstab
```

```
# Thêm dòng cuối:
/dev/sdb1   /mnt/dstore   ext4   defaults   0   2
```

```bash
# Kiểm tra fstab không lỗi
sudo mount -a
```

### Prometheus — Monitoring

```bash
# Cài đặt
sudo apt install -y prometheus prometheus-node-exporter

# Khởi động
sudo systemctl start prometheus
sudo systemctl enable prometheus

# Truy cập UI: http://IP:9090

# Kiểm tra trạng thái
sudo systemctl status prometheus
```

**Alertmanager:** Cấu hình gửi email khi CPU quá tải qua file `/etc/prometheus/alertmanager.yml`.

---

## Bài 12

### Quản lý Hệ thống, Package & FTP Server

**Mục tiêu:** Biến môi trường, alias, quản lý gói, FTP server.

### Biến môi trường & Alias

```bash
# Tạo alias (lệnh tắt)
alias ll='ls -la'
alias update='sudo apt update && sudo apt upgrade'
alias cls='clear'

# Xem tất cả alias
alias

# Biến môi trường
export MY_VAR="Hello"
echo $MY_VAR

# Lưu alias vĩnh viễn → thêm vào ~/.bashrc
vim ~/.bashrc
# Thêm: alias ll='ls -la'
source ~/.bashrc  # Áp dụng ngay
```

### Quản lý Package với APT

```bash
# Cập nhật danh sách gói
sudo apt update

# Nâng cấp tất cả gói
sudo apt upgrade

# Cài đặt gói
sudo apt install -y <tên_gói>

# Xóa gói
sudo apt remove <tên_gói>
sudo apt purge <tên_gói>   # Xóa cả config

# Tìm kiếm gói
apt search <từ_khóa>

# Xem thông tin gói
apt show <tên_gói>

# Dọn dẹp
sudo apt autoremove
sudo apt clean
```

### Background Jobs

```bash
# Chạy process nền
sleep 100 &

# Xem job đang chạy
jobs

# Đưa job nền ra foreground
fg %1

# Đưa job foreground vào nền
Ctrl+Z    # Suspend
bg %1     # Resume ở background
```

### FTP Server (vsftpd)

```bash
# Cài đặt
sudo apt install -y vsftpd

# Cấu hình
sudo vim /etc/vsftpd.conf
# Chỉnh: write_enable=YES
#        local_umask=022
#        chroot_local_user=YES

# Khởi động
sudo systemctl restart vsftpd
sudo systemctl enable vsftpd

# Tạo user cho FTP
sudo adduser webne
```

Kết nối từ **FileZilla** → upload file vào `/var/www/html/`.

---

## Bài 13

### Web Server 1 — Apache + PHP

**Mục tiêu:** Cài đặt Apache, cấu hình cơ bản, cài PHP.

### Cài đặt Apache

```bash
sudo apt install -y apache2
sudo systemctl start apache2
sudo systemctl enable apache2
sudo systemctl status apache2

# Kiểm tra trên browser: http://IP/
```

### Cấu hình Apache

```bash
sudo vim /etc/apache2/sites-enabled/000-default.conf
```

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    ServerName  server.example.com
    DocumentRoot /var/www/html

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

```bash
# Kiểm tra cú pháp cấu hình
sudo apache2ctl configtest

# Reload
sudo systemctl reload apache2
```

### Cấu hình DirectoryIndex

```bash
sudo vim /etc/apache2/mods-enabled/dir.conf
```

```apache
DirectoryIndex index.php index.html index.htm
```

### Cài đặt PHP

```bash
sudo apt install -y php libapache2-mod-php php-mysql php-curl php-gd php-mbstring

# Kiểm tra phiên bản
php -v
```

### Tạo file PHP kiểm tra

```bash
sudo vim /var/www/html/kad13.php
```

```php
<?php
phpinfo();
?>
```

```bash
# Xem tại: http://IP/kad13.php
sudo systemctl restart apache2
```

### Quyền thư mục web

```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

---

## Bài 14

### Web Server 2 — Userdir & Virtual Host

**Mục tiêu:** Kích hoạt Userdir, cấu hình Virtual Host với domain ảo.

### Userdir — Không gian web cá nhân

```bash
# Kích hoạt module userdir
sudo a2enmod userdir
sudo systemctl reload apache2

# Tạo thư mục public_html
mkdir ~/public_html
chmod 755 ~/public_html

# Tạo file index
vim ~/public_html/index.html
```

Truy cập qua: `http://IP/~username/`

### Virtual Host

```bash
# Tạo file cấu hình Virtual Host
sudo vim /etc/apache2/sites-available/vhost.conf
```

```apache
<VirtualHost *:80>
    ServerName   comp.ecc-skills.jp
    ServerAdmin  admin@ecc-skills.jp
    DocumentRoot /var/www/vhost

    <Directory /var/www/vhost>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/vhost_error.log
    CustomLog ${APACHE_LOG_DIR}/vhost_access.log combined
</VirtualHost>
```

```bash
# Kích hoạt site
sudo a2ensite vhost.conf
sudo systemctl reload apache2

# Tạo thư mục web cho vhost
sudo mkdir -p /var/www/vhost
sudo vim /var/www/vhost/index.html
```

### Trỏ domain ảo (trên Windows)

Sửa file `C:\Windows\System32\drivers\etc\hosts`:

```
192.168.x.x   comp.ecc-skills.jp
```

Truy cập: `http://comp.ecc-skills.jp/`

---

## Bài 15

### Xây dựng WordPress (LAMP Stack hoàn chỉnh)

**Mục tiêu:** Tích hợp Linux + Apache + MySQL + PHP để triển khai WordPress.

### Cài đặt MySQL

```bash
sudo apt install -y mysql-server

# Bảo mật MySQL
sudo mysql_secure_installation

# Đăng nhập
sudo mysql -u root -p
```

### Tạo Database & User cho WordPress

```sql
-- Tạo database
CREATE DATABASE wpdata CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'wp_password_123';

-- Cấp quyền
GRANT ALL PRIVILEGES ON wpdata.* TO 'wpuser'@'localhost';

-- Áp dụng
FLUSH PRIVILEGES;

-- Thoát
EXIT;
```

### Tải và cài đặt WordPress

```bash
# Tải WordPress
cd /tmp
curl -O https://wordpress.org/latest.tar.gz

# Giải nén
tar -xzf latest.tar.gz

# Copy vào web root
sudo cp -r wordpress/* /var/www/html/

# Phân quyền
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### Cấu hình wp-config.php

```bash
cd /var/www/html
sudo cp wp-config-sample.php wp-config.php
sudo vim wp-config.php
```

```php
define( 'DB_NAME', 'wpdata' );
define( 'DB_USER', 'wpuser' );
define( 'DB_PASSWORD', 'wp_password_123' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
```

### Hoàn tất cài đặt qua Web

Truy cập `http://IP/` → Làm theo wizard:
1. Chọn ngôn ngữ
2. Nhập thông tin site, admin account
3. Cài đặt xong → Đăng nhập admin
4. Viết bài đăng mới (**Posts → Add New**)

---

## Nâng Cao

### UNIX Server II — Các Chuyên đề Mở rộng

---

### SSL & HTTPS — Chứng chỉ tự ký

```bash
# Cài mod_ssl
sudo a2enmod ssl
sudo systemctl restart apache2

# Tạo CA và chứng chỉ tự ký
sudo mkdir -p /etc/ssl/myca
cd /etc/ssl/myca

# Tạo CA private key
openssl genrsa -out ca.key 2048

# Tạo CA certificate
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt

# Tạo server key
openssl genrsa -out server.key 2048

# Tạo CSR (Certificate Signing Request)
openssl req -new -key server.key -out server.csr

# Ký chứng chỉ bằng CA
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key \
    -CAcreateserial -out server.crt
```

**Cấu hình HTTPS trong Apache** (`/etc/apache2/sites-available/default-ssl.conf`):
```apache
SSLEngine on
SSLCertificateFile    /etc/ssl/myca/server.crt
SSLCertificateKeyFile /etc/ssl/myca/server.key
```

```bash
sudo a2ensite default-ssl.conf
sudo systemctl reload apache2
# Truy cập: https://IP/
```

### Reverse Proxy (Nginx)

```bash
sudo apt install -y nginx

sudo vim /etc/nginx/sites-available/reverse-proxy.conf
```

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Samba Server — Chia sẻ file với Windows

```bash
sudo apt install -y samba

sudo vim /etc/samba/smb.conf
```

```ini
[shared]
    path = /srv/samba/shared
    browseable = yes
    read only = no
    valid users = @unix

[homes]
    comment = Home Directories
    browseable = no
    read only = no
    create mask = 0700
    directory mask = 0700
```

```bash
# Tạo thư mục share
sudo mkdir -p /srv/samba/shared
sudo chown :unix /srv/samba/shared
sudo chmod 770 /srv/samba/shared

# Tạo Samba password cho user
sudo smbpasswd -a username

sudo systemctl restart smbd
sudo ufw allow samba
```

---

### DNS Server (BIND9)

```bash
sudo apt install -y bind9 bind9utils

sudo vim /etc/bind/named.conf.local
```

```
zone "example.local" {
    type master;
    file "/etc/bind/db.example.local";
};

zone "x.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.x";
};
```

```bash
# Kiểm tra cú pháp
sudo named-checkconf
sudo named-checkzone example.local /etc/bind/db.example.local

sudo systemctl restart bind9
```

---

### Mail Server (Postfix + Dovecot)

```bash
# Cài đặt
sudo apt install -y postfix dovecot-pop3d dovecot-imapd

# Cấu hình Postfix
sudo vim /etc/postfix/main.cf
```

```
myhostname = mail.example.com
mydomain = example.com
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, $mydomain
```

```bash
sudo systemctl restart postfix dovecot
sudo ufw allow 25   # SMTP
sudo ufw allow 110  # POP3
sudo ufw allow 143  # IMAP
```

---

### Quản lý Log Hệ thống

```bash
# Xem log systemd (journald)
journalctl -xe
journalctl -u apache2
journalctl -f            # Follow realtime
journalctl --since "2024-01-01" --until "2024-12-31"

# Xem log rsyslog
tail -f /var/log/syslog
tail -f /var/log/auth.log    # Đăng nhập/bảo mật
tail -f /var/log/apache2/access.log

# Cài Logwatch
sudo apt install -y logwatch

# Chạy thủ công
sudo logwatch --output stdout --detail high
```

---

## Tóm Tắt Lệnh Quan Trọng

### Hệ thống

```bash
uname -a               # Thông tin OS
uptime                 # Thời gian hoạt động
who                    # Ai đang đăng nhập
w                      # Chi tiết hơn
last                   # Lịch sử đăng nhập
df -h                  # Dung lượng ổ đĩa
du -sh *               # Dung lượng từng thư mục
free -h                # RAM
top / htop             # Process realtime
```

### Mạng

```bash
ip addr                # Xem IP
ip route               # Xem route
ping <host>            # Kiểm tra kết nối
nslookup <domain>      # Phân giải DNS
curl -I <URL>          # Kiểm tra HTTP header
ss -tulnp              # Xem port đang mở
netstat -tulnp         # (cũ hơn)
```

### Dịch vụ (systemctl)

```bash
sudo systemctl start   <service>
sudo systemctl stop    <service>
sudo systemctl restart <service>
sudo systemctl reload  <service>
sudo systemctl enable  <service>    # Tự khởi động cùng OS
sudo systemctl disable <service>
sudo systemctl status  <service>
```

### File nhanh

```bash
find / -name "*.txt"               # Tìm file
find /var -size +10M               # File lớn hơn 10MB
grep -r "pattern" /etc/            # Tìm chuỗi đệ quy
wc -l file.txt                     # Đếm dòng
head -20 file.txt                  # 20 dòng đầu
tail -20 file.txt                  # 20 dòng cuối
diff file1 file2                   # So sánh 2 file
tar -czf backup.tar.gz dir/        # Nén
tar -xzf backup.tar.gz             # Giải nén
```

---

*Tài liệu ôn tập tổng hợp từ NotebookLM — UNIX Server 構築演習 (15 tuần)*
