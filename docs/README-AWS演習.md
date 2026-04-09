# AWS演習 — 全バイ一覧 (Danh sách toàn bộ bài tập)

> Nguồn: NotebookLM — AWS Cloud Foundations + AWS Cloud Architecture

---

## AWS1 — Cloud Foundations (基礎)

| File | Bài | Nội dung chính | Services |
|------|-----|----------------|----------|
| [AWS1-01-EC2基礎.md](AWS1-01-EC2基礎.md) | 演習0 + ACFラボ3 | Launch EC2, cài Apache, Termination Protection | EC2 |
| [AWS1-02-VPC演習.md](AWS1-02-VPC演習.md) | VPC演習 1・2・3 | 2-tier VPC: Web(public) + DB(private), NAT GW | VPC, EC2, MariaDB |
| [AWS1-03-EBS演習.md](AWS1-03-EBS演習.md) | EBSラボ4 | Attach volume, format, mount, Snapshot, Restore | EBS |
| [AWS1-04-RDS演習.md](AWS1-04-RDS演習.md) | RDSラボ5 | Managed MySQL, Subnet Group, Parameter Group | RDS |
| [AWS1-05-S3演習.md](AWS1-05-S3演習.md) | S3演習 1-1~1-3 | Static Website, Versioning, Lifecycle, CRR | S3 |
| [AWS1-06-EFS演習.md](AWS1-06-EFS演習.md) | EFS演習 | Shared NFS filesystem cho nhiều EC2 | EFS |
| [AWS1-07-ELB+AutoScaling演習.md](AWS1-07-ELB+AutoScaling演習.md) | ELB演習 + AutoScaling | ALB, AMI, Launch Template, ASG (Min:2/Max:6) | ALB, ASG |
| [AWS1-08-設計パターン.md](AWS1-08-設計パターン.md) | 設計パターン演習1 | 3-tier + Bastion Host, 5 Subnets, Aurora | VPC, ALB, Aurora |

---

## AWS2 — Cloud Architecture & AI (応用)

| File | Bài | Nội dung chính | Services |
|------|-----|----------------|----------|
| [AWS2-07-Lambda演習.md](AWS2-07-Lambda演習.md) | Lambda 07-1~07-3/ACA13 | Python Lambda: DynamoDB, S3 write, Inventory system | Lambda, DynamoDB, S3, SNS |
| [AWS2-08-APIGateway演習.md](AWS2-08-APIGateway演習.md) | API Gateway 08-1~08-2 | REST API → Lambda → DynamoDB, Mapping Template | API GW, Lambda, DynamoDB |
| [AWS2-11-ECR+ECS-Fargate演習.md](AWS2-11-ECR+ECS-Fargate演習.md) | ECR + ECS演習 | Dockerfile, docker build/push, Fargate deploy | Cloud9, ECR, ECS, Fargate, ALB |
| [AWS2-復習課題2.md](AWS2-復習課題2.md) | 復習課題2 | Full serverless: EC2 Frontend + API GW + Lambda + DB + S3 | EC2, API GW, Lambda, DynamoDB, S3 |

---

## Diagram Files (draw.io)

| File | Nội dung |
|------|----------|
| [aws1-exercises.drawio](aws1-exercises.drawio) | Sơ đồ kiến trúc AWS1 (10 trang) |
| [aws2-exercises.drawio](aws2-exercises.drawio) | Sơ đồ kiến trúc AWS2 (11 trang) |

---

## Các Service Hay Dùng — Quick Reference

### Networking
```
VPC CIDR:    10.x.0.0/16
Public Sub:  10.x.10.0/24  (Auto Public IP: ON)
Private Sub: 10.x.11.0/24  (Auto Public IP: OFF)
IGW → Public Route Table:  0.0.0.0/0 → IGW
NAT GW → Private Route:    0.0.0.0/0 → NAT GW
```

### EC2
```
AMI:        Amazon Linux 2023
Type:       t2.micro / t3.micro
User:       ec2-user
SSH:        ssh ec2-user@IP -i key.pem
Apache:     sudo yum install -y httpd && sudo systemctl start httpd
PHP:        sudo yum install -y php php-mysqli
```

### Security Groups thường gặp
```
Web Server:  SSH:22 + HTTP:80 from 0.0.0.0/0
DB Server:   SSH:22 + MySQL:3306 from VPC CIDR only
ALB:         HTTP:80 from 0.0.0.0/0
Bastion:     SSH:22 from 0.0.0.0/0
EFS:         NFS:2049 from EC2 SG
```

### Lambda Python boilerplate
```python
import json, boto3

def lambda_handler(event, context):
    # Your code
    return {
        'statusCode': 200,
        'body': json.dumps({'result': 'ok'})
    }
```

### Key pair
```
Type: ED25519
Format: .pem
SSH user: ec2-user
chmod 600 key.pem
```
