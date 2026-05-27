// ==========================================================================
// PRICING SYSTEM & CALCULATION LOGIC (PONTO CARD)
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
    
    msg += `\n👤 *Nome:* ${name}\n`;
    
    msg += `\n---`;
    msg += `\nAguardando combinar retirada e pagamento via Pix!`;
    
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
