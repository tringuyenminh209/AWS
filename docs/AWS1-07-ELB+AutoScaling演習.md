# AWS1-07: ELB演習 + Auto Scaling演習 — 負荷分散と自動スケーリング

> **Mục tiêu:** Cấu hình ALB phân phối traffic, tạo AMI, Launch Template, Auto Scaling Group tự động mở rộng.

---

## Phần 1: ELB演習 1 & 2 — Application Load Balancer

### Kiến trúc

```
Internet → ALB (2 Public Subnets)
              └── Target Group
                    ├── EC2 pubsv01 (AZ-a)
                    └── EC2 pubsv02 (AZ-b)
```

### Bước 1: Tạo Target Group

1. **EC2 → Target Groups → Create target group**

| Mục | Giá trị |
|-----|---------|
| Target type | Instances |
| Tên | `[クラス名]-web-tg` |
| Protocol | HTTP / Port 80 |
| VPC | VPC bài VPC演習 |
| Health check path | `/index.php` hoặc `/index.html` |

2. **Register targets** → chọn EC2 Web Server → **Include as pending**

### Bước 2: Tạo Application Load Balancer

1. **EC2 → Load Balancers → Create load balancer → Application Load Balancer**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名]-web-elb` |
| Scheme | Internet-facing |
| IP type | IPv4 |
| VPC | VPC bài VPC演習 |
| AZs | us-east-1a + us-east-1b (cả 2 Public Subnets) |
| SG | Mở HTTP port 80 từ 0.0.0.0/0 |
| Listener | HTTP:80 → Forward to Target Group |

2. Chờ trạng thái: **Active** ✅
3. Ghi lại **DNS name** của ALB

### Bước 3: Kiểm tra ALB

```
http://[ALB_DNS_Name]/
```

→ F5 nhiều lần → traffic phân phối đều giữa 2 EC2 ✅

---

## Phần 2: Auto Scaling演習 1-1 & 1-2

### Bước 1: Tạo AMI từ Web Server

1. **Stop** EC2 instance `[クラス名]_pubsv01`
2. **Actions → Image and templates → Create image**

| Mục | Giá trị |
|-----|---------|
| Image name | `[クラス名]_websv_as` |
| No reboot | ✅ Enable (để không restart) |

3. Chờ AMI trạng thái: **Available** ✅

### Bước 2: Tạo Launch Template

1. **EC2 → Launch Templates → Create launch template**

| Mục | Giá trị |
|-----|---------|
| Tên | `web-sv-temp` |
| AMI | `[クラス名]_websv_as` (AMI tự sở hữu) |
| Instance type | `t2.micro` |
| Key pair | Key đã có |
| Network/Subnet | **Không bao gồm** (Do Not Include) |
| Security Groups | `[クラス名]_sg` |

### Bước 3: Tạo Auto Scaling Group

1. **EC2 → Auto Scaling Groups → Create**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-asg` |
| Launch Template | `web-sv-temp` |
| VPC | VPC bài VPC演習 |
| Subnets | Public Subnet us-east-1a + us-east-1b |

**Load balancing:**
- Attach to existing Target Group: `[クラス名]-web-tg`
- ✅ Enable ELB health checks

**Group size:**

| Mục | Giá trị |
|-----|---------|
| Desired | **2** |
| Min | **2** |
| Max | **6** |

**Scaling policies:**
- Target tracking scaling policy
- Metric: Average CPU Utilization → Target value: `60`

**Scale-in protection:** ✅ Enable

### Bước 4: Chỉnh Termination Policy

Để tránh xóa nhầm máy chủ gốc khi scale-in:

1. **Auto Scaling Group → Advanced configurations**
2. **Termination policies** → chọn: **Newest instance** (最新のインスタンス)

> Hệ thống sẽ ưu tiên xóa các EC2 mới nhất khi scale-in.

### Bước 5: Kiểm tra Auto Scaling

```bash
# Test tải trên 1 EC2 để kích hoạt Scale-out
sudo yum install -y stress
stress --cpu 8 --timeout 300
```

→ CloudWatch báo CPU > 60% → ASG tự tạo thêm EC2 ✅

---

## Checklist

- [ ] Target Group tạo xong với Health Check
- [ ] ALB Active — DNS name hoạt động
- [ ] ALB phân phối traffic đều 2 EC2
- [ ] AMI `[クラス名]_websv_as` — Available
- [ ] Launch Template `web-sv-temp` tạo xong
- [ ] ASG Min:2 / Desired:2 / Max:6
- [ ] Termination Policy: Newest instance
- [ ] Target tracking policy: CPU 60%
