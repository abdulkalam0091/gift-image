document.addEventListener('DOMContentLoaded', () => {
    const prizeForm = document.getElementById('prizeForm');
    const companyLogoInput = document.getElementById('company-logo');
    const prizeItemNameInput = document.getElementById('prize-item-name');
    const prizeImageUploadInput = document.getElementById('prize-image-upload');
    const shopNameInput = document.getElementById('shop-name');
    const prizeCanvas = document.getElementById('prizeCanvas');
    const ctx = prizeCanvas.getContext('2d');
    const finalImage = document.getElementById('finalImage');
    const downloadBtn = document.getElementById('download-btn');

    
    const config = {
    canvasWidth: 1080,
    canvasHeight: 1080,

    // 1. Logo Placement (MADE SMALLER)
    logo: {
        x: 540,             
        y: 48,              
        maxWidth: 620,     
        maxHeight: 150     
    },

    // 2. Prize Name Placement (Text on yellow box)
prizeName: {
    x: 540, 
    y: 395, // Center of yellow box
    fontSize: 32,
    color: '#000000',
    fontFamily: 'Arial, sans-serif'
},

    // 3. Prize Image Placement (CENTERED ON PODIUM - RESTORED)
prizeImage: {
    x: 590, // Centered
    y: 450, // Top of image area (podium)
    maxWidth: 360,
    maxHeight: 360
},

    shopName: {
        x: 540,             
        y: 865,             
        fontSize: 40,
        color: '#D20A11',
        fontFamily: 'Arial, sans-serif'
    }
};
   
// ... rest of the code remains the same
    prizeCanvas.width = config.canvasWidth;
    config.canvasHeight;
    prizeCanvas.height = config.canvasHeight;

    let backgroundImage = new Image();
    let companyLogoImg = new Image();
    let prizeItemImg = new Image();

    // --- Background Image Source Handling ---
    const currentBgSource = 'nevaa coupon (4).jpg'; 
    
    backgroundImage.src = currentBgSource;
    backgroundImage.onload = () => { drawCanvas(); };
    backgroundImage.onerror = () => { console.error("Error loading background image. Check the source path/URL."); };
    // ----------------------------------------


    // Function to calculate image position for centering (UNITS ARE PIXELS)
    function getCenteredPosition(img, targetXCenter, targetYTop, maxWidth, maxHeight) {
        let { naturalWidth: w, naturalHeight: h } = img;

        // Scale to fit max dimensions while maintaining aspect ratio
        const ratio = Math.min(maxWidth / w, maxHeight / h);
        w = w * ratio;
        h = h * ratio;

        // Calculate top-left X position to center it horizontally in the target area
        const x = targetXCenter - (w / 2);

        // Center vertically in the slot (y: targetYTop + vertical offset)
        return { x, y: targetYTop + (maxHeight - h) / 2, w, h };
    }

    // Main drawing function
    function drawCanvas() {
        ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

        // 1. Draw Background
        if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
            ctx.drawImage(backgroundImage, 0, 0, config.canvasWidth, config.canvasHeight);
        } else {
            ctx.fillStyle = "#e0e0e0";
            ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
        }

        // 2. Draw Company Logo (Horizontally and Vertically Centered in its slot)
        if (companyLogoImg.complete && companyLogoImg.naturalWidth > 0) {
            const pos = getCenteredPosition(
                companyLogoImg,
                config.logo.x,
                config.logo.y,
                config.logo.maxWidth,
                config.logo.maxHeight
            );
            ctx.drawImage(companyLogoImg, pos.x, pos.y, pos.w, pos.h);
        }

        // 3. Draw Prize Item Image (Horizontally and Vertically Centered on the podium)
        if (prizeItemImg.complete && prizeItemImg.naturalWidth > 0) {
            const pos = getCenteredPosition(
                prizeItemImg,
                config.prizeImage.x,
                config.prizeImage.y,
                config.prizeImage.maxWidth,
                config.prizeImage.maxHeight
            );
            ctx.drawImage(prizeItemImg, pos.x, pos.y, pos.w, pos.h);
        }
        
        // 4. Draw Prize Item Name (Centered, fits inside the yellow highlight)
        const prizeNameText = prizeItemNameInput.value.toUpperCase();
        if (prizeNameText) {
            ctx.font = `bold ${config.prizeName.fontSize}px ${config.prizeName.fontFamily}`; // Set to standard 'bold'
            ctx.fillStyle = config.prizeName.color;
            ctx.textAlign = 'center'; 
            ctx.fillText(prizeNameText, config.prizeName.x, config.prizeName.y);
        }

        // 5. Draw Shop Name (Centered above the instruction text)
        const shopNameText = shopNameInput.value.toUpperCase();
        if (shopNameText) {
            ctx.font = `bold ${config.shopName.fontSize}px ${config.shopName.fontFamily}`;
            ctx.fillStyle = config.shopName.color;
            ctx.textAlign = 'center'; 
            ctx.fillText(shopNameText, config.shopName.x, config.shopName.y);
        }
    }

    // --- Input and Event Handlers (Unchanged) ---
    function handleImageUpload(input, targetImg) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                targetImg.src = event.target.result;
                targetImg.onload = drawCanvas;
            };
            reader.readAsDataURL(file);
        }
    }

    prizeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // --- HARD VALIDATION: DON'T ALLOW EMPTY FIELDS ---
    if (
        !companyLogoInput.files.length ||
        !prizeImageUploadInput.files.length ||
        prizeItemNameInput.value.trim() === "" ||
        shopNameInput.value.trim() === ""
    ) {
        alert("Fill all fields and upload both images.");
        return;
    }

    // --- Generate Image ---
    drawCanvas();
    finalImage.src = prizeCanvas.toDataURL('image/png');
    finalImage.style.display = 'block';
    downloadBtn.style.display = 'block';
});


    companyLogoInput.addEventListener('change', (e) => handleImageUpload(e.target, companyLogoImg));
    prizeImageUploadInput.addEventListener('change', (e) => handleImageUpload(e.target, prizeItemImg));
    
    prizeItemNameInput.addEventListener('input', drawCanvas);
    shopNameInput.addEventListener('input', drawCanvas);

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'prize_image.png';
        link.href = prizeCanvas.toDataURL('image/png');
        link.click();
    });

    drawCanvas();
});