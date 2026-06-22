document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------
    // PHẦN 1: TÍNH NĂNG NÚT RSVP CỦA BẠN
    // -----------------------------------------------------
    const rsvpBtn = document.getElementById("rsvp-btn");

    if (rsvpBtn) {
        rsvpBtn.addEventListener("click", () => {
            // Trích xuất số điện thoại từ text
            const phoneNumber = "+1234567890"; 
            
            // Copy số điện thoại vào clipboard
            navigator.clipboard.writeText(phoneNumber).then(() => {
                alert("Đã copy số điện thoại: " + phoneNumber + "\nHãy gửi tin nhắn để xác nhận tham dự nhé!");
            }).catch(err => {
                console.error('Không thể copy text: ', err);
                // Fallback nếu trình duyệt không hỗ trợ clipboard API
                alert("Vui lòng liên hệ số: " + phoneNumber + " để xác nhận tham dự nhé!");
            });
        });
    }

    // -----------------------------------------------------
    // PHẦN 2: HIỆU ỨNG PHÁO HOA PASTEL
    // -----------------------------------------------------
    const canvas = document.getElementById('fireworks');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Tự động thay đổi kích thước canvas theo màn hình
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Danh sách màu sắc pháo hoa hợp với tone Xanh Dương Pastel
    const pastelColors = [
        '#3d8cc1', // Xanh pastel chủ đạo
        '#6fa7eb', // Xanh dương ánh kim nhạt
        '#f0d279', // Vàng kem
        '#ab9afa', // Tím nhẹ pastel
        '#f07474'  // Trắng sáng lấp lánh
    ];

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.radius = Math.random() * 2 + 1; 
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1.5;
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.012; 
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.04; // Trọng lực
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
            this.speed = Math.random() * 4 + 5;
            this.particles = [];
            this.exploded = false;
            this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        }

        update() {
            if (!this.exploded) {
                this.y -= this.speed; 
                if (this.y <= this.targetY) {
                    this.exploded = true;
                    this.explode();
                }
            } else {
                for (let i = this.particles.length - 1; i >= 0; i--) {
                    this.particles[i].update();
                    if (this.particles[i].alpha <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }
        }

        explode() {
            const particleCount = Math.floor(Math.random() * 20) + 50; 
            for (let i = 0; i < particleCount; i++) {
                this.particles.push(new Particle(this.x, this.y, this.color));
            }
        }

        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                this.particles.forEach(p => p.draw());
            }
        }
    }

    let fireworks = [];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.03) {
            fireworks.push(new Firework());
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
                fireworks.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Bắt đầu vòng lặp pháo hoa
    animate();
});