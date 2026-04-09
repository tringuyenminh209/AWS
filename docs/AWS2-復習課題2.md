# AWS2-復習課題2: サーバーレス菓子販売システム

> **Mục tiêu:** Tích hợp EC2 (Frontend) + API Gateway + Lambda + DynamoDB + S3 xây dựng hệ thống bán hàng serverless hoàn chỉnh.

---

## Kiến trúc

```
ユーザー
   │ HTTP
   ▼
EC2 Web Server
(HTML/PHP Frontend)
   │ AJAX / Fetch API
   ▼
API Gateway REST API
(/products?pid=xxxx)
   │ Invoke
   ▼
Lambda Function (Python)
   ├── DynamoDB.query() → 商品名・価格
   └── S3 URL生成 → 商品画像パス
   │
   Response: JSON {name, price, imageUrl}
   │
   ▼
EC2 → HTMLレンダリング → ユーザーに表示
```

---

## Bước 1: DynamoDB — Bảng sản phẩm

1. **DynamoDB → Create table**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-cake-table` |
| Partition key | `pid` (Number) |

### Insert dữ liệu mẫu

```bash
# Qua AWS Console hoặc Lambda test
```

| pid | pname | category | price | image_key |
|-----|-------|----------|-------|-----------|
| 1001 | ショートケーキ | ケーキ | 500 | cake01.jpg |
| 1002 | チョコケーキ | ケーキ | 600 | cake02.jpg |
| 1003 | チーズケーキ | ケーキ | 450 | cake03.jpg |
| 1004 | モンブラン | ケーキ | 700 | cake04.jpg |

---

## Bước 2: S3 — Lưu trữ hình ảnh

1. Tạo Bucket: `[クラス名+番号]-images`
2. **Tắt Block all public access**
3. Upload các file: `cake01.jpg`, `cake02.jpg`, ...
4. **Bucket Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::[クラス名+番号]-images/*"
    }
  ]
}
```

---

## Bước 3: Lambda — Backend API

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-products-function` |
| Runtime | Python 3.x |
| Role | LabRole |

```python
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('[クラス名+番号]-cake-table')

S3_BUCKET = '[クラス名+番号]-images'
S3_BASE_URL = f'https://{S3_BUCKET}.s3.amazonaws.com'

def lambda_handler(event, context):
    # 全件取得
    if event.get('action') == 'list':
        response = table.scan()
        items = response.get('Items', [])
        
    # 1件取得
    else:
        pid = int(event.get('pid', 1001))
        response = table.get_item(Key={'pid': pid})
        items = [response.get('Item', {})]
    
    # Decimal → int 変換
    result = []
    for item in items:
        result.append({
            'pid':      int(item.get('pid', 0)),
            'pname':    item.get('pname', ''),
            'category': item.get('category', ''),
            'price':    int(item.get('price', 0)),
            'imageUrl': f"{S3_BASE_URL}/{item.get('image_key', 'default.jpg')}"
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(result, ensure_ascii=False)
    }
```

---

## Bước 4: API Gateway

1. Tạo **REST API**: `[クラス名+番号]-products-API`
2. Method: **GET** → Lambda `[クラス名+番号]-products-function`
3. **Mapping Template** (`application/json`):

```velocity
#set($action = $input.params('action'))
#set($pid = $input.params('pid'))
{
  "action": "$action",
  "pid": #if($pid != "")$pid#{else}0#end
}
```

4. **Enable CORS** (重要): Actions → Enable CORS
5. **Deploy** → Stage: `prod`
6. Ghi lại Invoke URL

---

## Bước 5: EC2 Web Server — Frontend

### Khởi tạo EC2

| Mục | Giá trị |
|-----|---------|
| AMI | Amazon Linux 2023 |
| Type | t2.micro |
| SG | HTTP:80 + SSH:22 open |
| Public IP | Enable |

```bash
# Cài Apache + PHP
sudo yum install -y httpd php
sudo systemctl start httpd
sudo systemctl enable httpd
```

### Tạo trang web `index.php`

```php
<?php
$api_url = 'https://[INVOKE_URL]/prod?action=list';
$json = file_get_contents($api_url);
$products = json_decode($json, true);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>菓子販売システム</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .product { border: 1px solid #ccc; margin: 10px; padding: 15px; display: inline-block; }
        .product img { width: 150px; height: 150px; object-fit: cover; }
    </style>
</head>
<body>
    <h1>🎂 菓子一覧</h1>
    <?php foreach ($products as $p): ?>
    <div class="product">
        <img src="<?= htmlspecialchars($p['imageUrl']) ?>" alt="<?= htmlspecialchars($p['pname']) ?>">
        <h3><?= htmlspecialchars($p['pname']) ?></h3>
        <p>¥<?= $p['price'] ?></p>
    </div>
    <?php endforeach; ?>
</body>
</html>
```

```bash
sudo cp index.php /var/www/html/
sudo chown www-data:www-data /var/www/html/index.php
```

### Kiểm tra

```
http://[EC2_Public_IP]/
```

→ Danh sách sản phẩm với hình ảnh từ S3 hiển thị ✅

---

## Bước 6: CloudWatch Monitoring (tùy chọn)

```bash
# Lambda tự động ghi log vào CloudWatch
# Xem tại: CloudWatch → Log groups → /aws/lambda/[function-name]
```

---

## Luồng dữ liệu đầy đủ

```
1. User truy cập http://EC2-IP/
2. EC2 PHP gọi API Gateway: GET /prod?action=list
3. API GW → Lambda
4. Lambda scan DynamoDB → lấy danh sách sản phẩm
5. Lambda tạo S3 URL cho từng sản phẩm
6. Lambda trả JSON → API GW → EC2
7. EC2 PHP render HTML với <img src="S3 URL">
8. Browser load hình ảnh trực tiếp từ S3
9. User thấy danh sách sản phẩm với hình ảnh ✅
```

---

## Checklist

- [ ] DynamoDB table với dữ liệu mẫu
- [ ] S3 bucket public với hình ảnh sản phẩm
- [ ] Lambda function đọc DynamoDB + tạo S3 URL
- [ ] API Gateway deploy lên stage `prod`
- [ ] CORS enabled trên API Gateway
- [ ] EC2 Apache + PHP chạy
- [ ] index.php gọi API và render HTML
- [ ] Trang web hiển thị sản phẩm + hình ảnh ✅
