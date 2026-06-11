const canvas = document.getElementById('lampCanvas');
const ctx = canvas.getContext('2d');
const bodyBg = document.getElementById('bodyBg');

let isLightOn = false;

// Set canvas size to match its container
function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
resize();

// Lamp's coordinates (fixed on the left side)
const lampX = 220;
const lampY = 160;
const baseLineY = 380;

// Cord's physics state variables
let cordStartX = lampX - 45; // Cord will hang from inside the lamp's shade
let cordStartY = lampY + 30;
let currentX = cordStartX;
let currentY = cordStartY + 140; // Default cord length
let targetX = currentX;
let targetY = currentY;
let defaultLength = 140;

let isDragging = false;
let vx = 0; // Velocity or Velocity X
let vy = 0; // Velocity Y
const tension = 0.15; //  Spring tension or elasticity
const friction = 0.82; //  Air or frictional force

//  Mouse and touch event handlers
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the mouse is clicked on the cord (10 pixels radius)
    const distance = Math.hypot(mouseX - currentX, mouseY - currentY);
    if (distance < 25) {
        isDragging = true;
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Set the limit for how far the cord can be pulled down
    targetX = mouseX;
    targetY = Math.max(cordStartY + 20, Math.min(mouseY, cordStartY + 260));
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    // If the cord is pulled down sufficiently (e.g., more than 30 pixels), toggle the light
    if (targetY > cordStartY + defaultLength + 30) {
        isLightOn = !isLightOn;
        if (isLightOn) {
            bodyBg.className = 'light-on';
        } else {
            bodyBg.className = 'light-off';
        }
    }

    // Mouse release: target returns to default position
    targetX = cordStartX;
    targetY = cordStartY + defaultLength;
});

// ক্যানভাসে ল্যাম্প এবং সুতলি ড্র করার মেইন ইঞ্জিন
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ১. সুতলির ফিজিক্স ক্যালকুলেশন (Spring Hooke's Law)
    if (!isDragging) {
        let ax = (targetX - currentX) * tension;
        let ay = (targetY - currentY) * tension;
        vx = (vx + ax) * friction;
        vy = (vy + ay) * friction;
        currentX += vx;
        currentY += vy;
    } else {
        currentX = targetX;
        currentY = targetY;
    }

    // 2. Yellow light from behind the lamp when the light is on (Glow Effect)
    if (isLightOn) {
        ctx.save();
        let gradient = ctx.createRadialGradient(lampX, lampY, 10, lampX, lampY + 150, 300);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.2, 'rgba(252, 214, 138, 0.5)');
        gradient.addColorStop(1, 'rgba(252, 214, 138, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(lampX - 80, lampY + 40);
        ctx.lineTo(lampX + 80, lampY + 40);
        ctx.lineTo(lampX + 350, canvas.height);
        ctx.lineTo(lampX - 350, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 3. Drawing the lamp stand and base (Cute Stand)
    ctx.fillStyle = isLightOn ? '#5a6275' : '#3a4050';
    ctx.beginPath();
    ctx.ellipse(lampX, baseLineY, 50, 15, 0, 0, Math.PI * 2); // Bottom circular base
    ctx.fill();

    ctx.fillRect(lampX - 6, lampY + 20, 12, baseLineY - lampY - 20); // Vertical rod

    // 4. Drawing the cord (The Interaction Cord)
    ctx.strokeStyle = isLightOn ? '#333' : '#999';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cordStartX, cordStartY);
    //Quadratic Curve to show a twine curve when pulled and bent
    ctx.quadraticCurveTo((cordStartX + currentX) / 2, (cordStartY + currentY) / 2, currentX, currentY);
    ctx.stroke();

    // Small ball or sphere at the bottom of the twine (The Pull Handle)
    ctx.fillStyle = isLightOn ? '#ffcc00' : '#666';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fill();

    // ৫. ল্যাম্পের শেড আঁকা (Top Cap)
    ctx.fillStyle = isLightOn ? '#e2e8f0' : '#475569';
    ctx.beginPath();
    ctx.moveTo(lampX - 50, lampY - 60); // Top left corner
    ctx.lineTo(lampX + 50, lampY - 60); // Top right corner
    ctx.lineTo(lampX + 75, lampY + 40);  // Bottom right corner
    ctx.lineTo(lampX - 75, lampY + 40);  // Bottom left corner
    ctx.closePath();
    ctx.fill();

    // Two cute sleepy eyes inside the lamp (like the screenshot)
    ctx.strokeStyle = isLightOn ? '#2c3e50' : '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Left eye
    ctx.beginPath();
    ctx.arc(lampX - 25, lampY - 10, 8, 0, Math.PI, true);
    ctx.stroke();
    // Right eye
    ctx.beginPath();
    ctx.arc(lampX + 25, lampY - 10, 8, 0, Math.PI, true);
    ctx.stroke();

    requestAnimationFrame(draw);
}

// First call to start the animation loop
draw();