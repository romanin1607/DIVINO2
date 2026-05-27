// ==========================================================================
// PRICING SYSTEM & CALCULATION LOGIC (DIVINO TERROIR)
// ==========================================================================

// Global state
let currentQuantity = 1; // Default quantity set to 1 as requested
const BASE_PRICE = 7.00;
const STICKERS_PER_PACK = 7;
const WHATSAPP_NUMBER = "553499437614";

const priceTiers = [
    { min: 100, price: 6.50, discountPct: "7.1%" },
    { min: 80, price: 6.60, discountPct: "5.7%" },
    { min: 60, price: 6.70, discountPct: "4.3%" },
    { min: 40, price: 6.80, discountPct: "2.9%" },
    { min: 20, price: 6.90, discountPct: "1.4%" },
    { min: 0, price: 7.00, discountPct: "0%" }
];

// Get unit price based on the selected quantity
function getPackUnitPrice(qty) {
    for (let tier of priceTiers) {
        if (qty >= tier.min) {
            return tier.price;
        }
    }
    return BASE_PRICE;
}

// Format values to BRL currency string
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Dynamic 3D visualizer based on quantity range
function updateVisualizer(qty) {
    const container = document.getElementById('pack-visual-container');
    if (!container) return;
    
    let html = '';
    
    if (qty >= 1 && qty <= 19) {
        // Level 1: 1 pack lying down
        html = `
            <div class="visual-state level-1" style="animation: animFadeIn 0.3s ease;">
                <img src="assets/pacote.png" class="visual-pack-img single-pack-deitado" alt="1 Pacote">
            </div>
        `;
    } else if (qty >= 20 && qty <= 39) {
        // Level 2: 5 packs stacked
        html = `
            <div class="visual-state level-2" style="animation: animFadeIn 0.3s ease;">
                <img src="assets/pacote.png" class="visual-pack-img stack-2 p1" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-2 p2" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-2 p3" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-2 p4" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-2 p5" alt="Pacote">
            </div>
        `;
    } else if (qty >= 40 && qty <= 59) {
        // Level 3: 10 packs stacked (larger stack)
        html = `
            <div class="visual-state level-3" style="animation: animFadeIn 0.3s ease;">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p1" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p2" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p3" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p4" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p5" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p6" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p7" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p8" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p9" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-3 p10" alt="Pacote">
            </div>
        `;
    } else if (qty >= 60 && qty <= 79) {
        // Level 4: big pile (16 packs stacked side-by-side)
        html = `
            <div class="visual-state level-4" style="animation: animFadeIn 0.3s ease;">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p1" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p2" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p3" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p4" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p5" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p6" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p7" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p8" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p9" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p10" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p11" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p12" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p13" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p14" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p15" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-4 p16" alt="Pacote">
            </div>
        `;
    } else {
        // Level 5: 80+ mountain of packs (24 packs overlapping messy)
        html = `
            <div class="visual-state level-5" style="animation: animFadeIn 0.3s ease;">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p1" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p2" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p3" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p4" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p5" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p6" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p7" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p8" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p9" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p10" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p11" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p12" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p13" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p14" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p15" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p16" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p17" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p18" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p19" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p20" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p21" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p22" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p23" alt="Pacote">
                <img src="assets/pacote.png" class="visual-pack-img stack-5 p24" alt="Pacote">
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// Update DOM elements reflecting the state
function updatePricingUI() {
    const qtyInput = document.getElementById('qty-input');
    if (qtyInput) qtyInput.value = currentQuantity;

    const unitPrice = getPackUnitPrice(currentQuantity);
    const totalPrice = currentQuantity * unitPrice;
    
    // Calculate total standard price without discounts
    const standardTotalPrice = currentQuantity * BASE_PRICE;
    const totalSavings = standardTotalPrice - totalPrice;
    
    // Update elements
    const totalPriceElement = document.getElementById('calc-total-amount');
    const unitPriceElement = document.getElementById('calc-unit-price');
    const stickersCountElement = document.getElementById('calc-stickers-count');
    const savingRowElement = document.getElementById('calc-savings-row');
    const savingAmountElement = document.getElementById('calc-savings-amount');
    
    if (totalPriceElement) totalPriceElement.textContent = formatCurrency(totalPrice);
    if (unitPriceElement) unitPriceElement.textContent = `R$ ${formatCurrency(unitPrice)} por pacote`;
    if (stickersCountElement) {
        const stickersText = `${currentQuantity * STICKERS_PER_PACK} figurinhas inclusas`;
        stickersCountElement.textContent = `${currentQuantity} pacote${currentQuantity > 1 ? 's' : ''} · ${stickersText}`;
    }

    // Savings display
    if (totalSavings > 0) {
        if (savingRowElement) savingRowElement.style.display = 'flex';
        if (savingAmountElement) savingAmountElement.textContent = `- R$ ${formatCurrency(totalSavings)}`;
    } else {
        if (savingRowElement) savingRowElement.style.display = 'none';
    }

    // Update active state in tier buttons
    updateTierButtonsHighlight(unitPrice);
    
    // Update the interactive 3D visualizer
    updateVisualizer(currentQuantity);
}

// Update the active classes in the UI tier selection grid
function updateTierButtonsHighlight(currentUnitPrice) {
    document.querySelectorAll('.discount-tier-btn').forEach(btn => {
        const minQty = parseInt(btn.dataset.min, 10);
        const tierPrice = getPackUnitPrice(minQty);
        
        if (getPackUnitPrice(currentQuantity) === tierPrice && currentQuantity >= minQty) {
            // Find active tier
            // We highlight the highest matching tier
            let highestMatching = 0;
            for (let t of priceTiers) {
                if (currentQuantity >= t.min) {
                    highestMatching = t.min;
                    break;
                }
            }
            if (minQty === highestMatching) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        } else {
            btn.classList.remove('active');
        }
    });
}

// Adjust quantity by value (buttons + / -)
function adjustQuantity(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    updatePricingUI();
}

// Select a specific quantity tier (supports toggle-off click)
function selectQtyTier(qty) {
    if (currentQuantity === qty) {
        currentQuantity = 1; // Deselect: goes back to 1 package (base price)
    } else {
        currentQuantity = qty;
    }
    updatePricingUI();
}

// Handle manual input in quantity field
function handleQtyInputChange(val) {
    let num = parseInt(val, 10);
    if (isNaN(num) || num < 1) {
        num = 1;
    }
    currentQuantity = num;
    updatePricingUI();
}

// Checkout Modal Functions
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;
    
    // Fill checkout summary in modal
    const unitPrice = getPackUnitPrice(currentQuantity);
    const totalPrice = currentQuantity * unitPrice;
    const savings = (currentQuantity * BASE_PRICE) - totalPrice;
    
    document.getElementById('modal-qty').textContent = `${currentQuantity} pacote${currentQuantity > 1 ? 's' : ''}`;
    document.getElementById('modal-stickers').textContent = `${currentQuantity * STICKERS_PER_PACK} unidades`;
    
    const savingsRow = document.getElementById('modal-savings-row');
    if (savings > 0) {
        savingsRow.style.display = 'flex';
        document.getElementById('modal-savings').textContent = `R$ ${formatCurrency(savings)}`;
    } else {
        savingsRow.style.display = 'none';
    }
    
    document.getElementById('modal-total').textContent = `R$ ${formatCurrency(totalPrice)}`;
    
    modal.classList.add('open');
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('open');
}

// Submit checkout form and redirect to WhatsApp API
function sendWhatsAppOrder(e) {
    if (e) e.preventDefault();
    
    const name = document.getElementById('checkout-name').value.trim();
    const city = document.getElementById('checkout-city').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    
    if (!name) {
        alert("Por favor, preencha seu nome.");
        return;
    }

    const unitPrice = getPackUnitPrice(currentQuantity);
    const totalPrice = currentQuantity * unitPrice;
    const standardPrice = currentQuantity * BASE_PRICE;
    const savings = standardPrice - totalPrice;
    
    // Formatting WhatsApp Message content
    let msg = `👋 Olá! Gostaria de fazer um pedido de figurinhas:\n\n`;
    msg += `📦 *Produto:* Pacote de Figurinhas Panini Copa 2026\n`;
    msg += `🔢 *Quantidade:* ${currentQuantity} pacote${currentQuantity > 1 ? 's' : ''} (${currentQuantity * STICKERS_PER_PACK} figurinhas)\n`;
    msg += `💰 *Valor Total:* R$ ${formatCurrency(totalPrice)}\n`;
    
    if (savings > 0) {
        msg += `✨ *Economia:* R$ ${formatCurrency(savings)} (Desconto aplicado!)\n`;
    }
    
    msg += `\n👤 *Dados do Cliente:*\n`;
    msg += `• *Nome:* ${name}\n`;
    if (city) msg += `• *Cidade/Estado:* ${city}\n`;
    if (address) msg += `• *Endereço:* ${address}\n`;
    
    msg += `\n---`;
    msg += `\nAguardando instruções de pagamento via Pix/Cartão para concluir o envio!`;
    
    // Encode url format
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    closeCheckoutModal();
}

// Initialize listeners on DOM load
window.addEventListener('DOMContentLoaded', () => {
    updatePricingUI();
    
    // Attach listeners dynamically
    const qtyInput = document.getElementById('qty-input');
    if (qtyInput) {
        qtyInput.addEventListener('change', (e) => handleQtyInputChange(e.target.value));
        qtyInput.addEventListener('keyup', (e) => handleQtyInputChange(e.target.value));
    }
    
    // Form submit listener
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', sendWhatsAppOrder);
    }
});
