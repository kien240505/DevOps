# TechNova - E-Commerce Platform (DevOps CI/CD Project)

Dự án Website thương mại điện tử công nghệ cao (TechNova) tích hợp kiến trúc Fullstack hiện đại, hỗ trợ CI/CD tự động hóa toàn diện với **Jenkins**, **Docker Compose**, **GitHub Actions**, và triển khai lên **AWS EC2**.

---

## 🏗️ 1. Cấu trúc dự án (Project Structure)

```text
e-comment/
├── backend/                  # RESTful API (Node.js, Express, MSSQL / SQLite fallback)
│   ├── controllers/          # Xử lý nghiệp vụ Auth, Products, Orders, Admin, Contact
│   ├── routes/               # API endpoints
│   ├── tests/                # Bộ kiểm thử tự động Jest (Auth, Products, Orders, Contact, Admin)
│   ├── Dockerfile            # Multi-stage Docker image cho backend Node.js
│   └── database_mssql.sql    # DDL & Seed script cho SQL Server
├── frontend/                 # Giao diện người dùng (React 18, Vite, Lucide Icons, Vanilla CSS)
│   ├── src/                  # Components, Context, Services
│   ├── nginx.conf            # Nginx reverse proxy (/api -> backend:5000)
│   └── Dockerfile            # Build Vite & package vào Nginx Alpine
├── .github/workflows/        # GitHub Actions CI/CD Pipeline
│   └── deploy.yml            # Build & Push Docker Hub images
├── docker-compose.yml        # Điều phối các container Backend & Frontend
├── Jenkinsfile               # Pipeline tự động hóa: Test -> Build images -> Deploy
└── README.md                 # Hướng dẫn chi tiết
```

---

## 🚀 2. Chạy ứng dụng trên môi trường cục bộ (Local Development)

### Cách 1: Chạy trực tiếp với Node.js
1. **Backend**:
   ```bash
   cp backend/.env.example backend/.env
   # Điền thông tin kết nối MSSQL vào backend/.env
   npm run start:backend
   ```
2. **Frontend**:
   ```bash
   npm run dev
   ```
   *Frontend chạy tại:* `http://localhost:3000` (proxy request `/api` sang `http://localhost:5000`).

3. **Chạy kiểm thử tự động**:
   ```bash
   npm test
   ```

### Cách 2: Chạy với Docker Compose
```bash
docker compose up --build -d
```
*Giao diện Frontend:* `http://localhost:8081` (Cổng 8081 được dùng để không xung đột với Jenkins chạy ở cổng 8080).

---

## ☁️ 3. Triển khai lên AWS EC2 & Cấu hình Jenkins (AWS & Jenkins CI/CD)

### Bước 1: Khởi tạo EC2 Instance trên AWS
1. Khởi tạo một máy ảo **AWS EC2**:
   - **OS**: Ubuntu Server 22.04 LTS.
   - **Instance type**: `t2.medium` hoặc `t3.medium` (tối thiểu 2 vCPU, 4GB RAM khuyến nghị cho build Docker/Jenkins).
   - **Storage**: Tối thiểu 30GB gp3.
2. Cấu hình **Security Group (Inbound Rules)**:
   - `22`: SSH
   - `8080`: Jenkins Web Dashboard
   - `8081`: TechNova Frontend Web Application
   - `5000`: Backend API (tùy chọn nếu test riêng)

### Bước 2: Cài đặt Docker & Jenkins trên Server AWS
Đăng nhập SSH vào EC2 và thực thi:
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Java 21 (Jenkins yêu cầu)
sudo apt install -y fontconfig openjdk-21-jre

# Thêm Jenkins repository & cài đặt Jenkins
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update && sudo apt install -y jenkins
sudo systemctl enable --now jenkins

# Cài đặt Docker & Docker Compose Plugin
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"${UBUNTU_CODENAME:-$VERSION_CODENAME}\") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Cấp quyền Docker cho người dùng Jenkins
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu
sudo systemctl restart jenkins
```

### Bước 3: Cấu hình Pipeline trên Jenkins
1. Truy cập `http://<IP-AWS-EC2>:8080`.
2. Lấy mật khẩu khởi tạo bằng: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`.
3. Hoàn tất thiết lập ban đầu (Cài đặt plugin gợi ý và tạo tài khoản Admin).
4. Thêm Secret File Credential (tùy chọn nhưng khuyến nghị):
   - Vào **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials**.
   - Nhấn **Add Credentials** -> Chọn **Secret file**.
   - Đặt **ID**: `backend-env`.
   - Tải file nội dung từ `backend/.env.example` (với thông tin cấu hình DB thực tế).
5. Tạo New Item -> Chọn **Pipeline** hoặc **Multibranch Pipeline**:
   - Đặt tên: `TechNova-Ecommerce`.
   - Mục **Pipeline**: Chọn *Pipeline script from SCM* -> *Git*.
   - **Repository URL**: `https://github.com/kien240505/DevOps.git`.
   - **Branch Specifier**: `*/main`.
   - **Script Path**: `Jenkinsfile`.
   - Nhấn **Save** -> **Build Now**.

### Bước 4: Kiểm tra ứng dụng sau khi Deploy
- Frontend: `http://<IP-AWS-EC2>:8081`
- Backend Health / API: `http://<IP-AWS-EC2>:8081/api/products`
- Quản trị: Đăng nhập vào trang quản trị với tài khoản `admin` / `admin123`.

---

## 🔄 4. GitHub Actions (Tự động Build & Push Docker Hub)
Khi đẩy code lên nhánh `main`, file `.github/workflows/deploy.yml` tự động:
1. Kiểm tra build Frontend & xác thực dependencies Backend.
2. Đăng nhập Docker Hub (nếu đã cài đặt Secret `DOCKER_USERNAME` và `DOCKER_PASSWORD`).
3. Build và đẩy 2 images `technova-frontend` và `technova-backend` lên Docker Hub.
