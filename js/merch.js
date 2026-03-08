// Great Minds Creating - Merch Store
// Stripe Payment Integration

// Initialize Stripe (replace with your actual publishable key)
// Get your key from: https://dashboard.stripe.com/apikeys
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE'); // Replace with actual key
const elements = stripe.elements();
let cardElement = null;

// ============================================
// CHECKOUT MODAL
// ============================================

function openCheckout(productName, price) {
    const modal = document.getElementById('checkoutModal');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const checkoutProductName = document.getElementById('checkoutProductName');
    const checkoutProductPrice = document.getElementById('checkoutProductPrice');

    if (modal && productNameInput && productPriceInput) {
        productNameInput.value = productName;
        productPriceInput.value = price;
        checkoutProductName.textContent = productName;
        checkoutProductPrice.textContent = `$${price.toFixed(2)}`;

        modal.style.display = 'block';

        // Initialize Stripe Elements
        if (!cardElement) {
            initializeStripeElements();
        }
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make functions globally available
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;

// ============================================
// STRIPE ELEMENTS
// ============================================

function initializeStripeElements() {
    const cardElementContainer = document.getElementById('card-element');
    if (!cardElementContainer) return;

    // Create card element
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: '#cccccc',
                },
            },
            invalid: {
                color: '#ff3860',
            },
        },
    });

    cardElement.mount('#card-element');

    // Handle real-time validation errors
    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

// ============================================
// CHECKOUT FORM SUBMISSION
// ============================================

const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = document.getElementById('submitPayment');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        try {
            const orderData = {
                productName: document.getElementById('productName').value,
                productPrice: parseFloat(document.getElementById('productPrice').value),
                size: document.getElementById('productSize').value,
                quantity: parseInt(document.getElementById('productQuantity').value),
                customerName: document.getElementById('customerName').value,
                customerEmail: document.getElementById('customerEmail').value,
                customerPhone: document.getElementById('customerPhone').value,
                shippingAddress: {
                    address: document.getElementById('shippingAddress').value,
                    city: document.getElementById('shippingCity').value,
                    state: document.getElementById('shippingState').value,
                    zip: document.getElementById('shippingZip').value
                },
                orderDate: new Date().toISOString(),
                status: 'pending'
            };

            // Calculate total
            const total = orderData.productPrice * orderData.quantity;

            // Create payment intent
            // NOTE: In production, this should be done server-side
            // This is a simplified client-side example for demonstration

            // Create payment method
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: orderData.customerName,
                    email: orderData.customerEmail,
                    phone: orderData.customerPhone,
                    address: {
                        line1: orderData.shippingAddress.address,
                        city: orderData.shippingAddress.city,
                        state: orderData.shippingAddress.state,
                        postal_code: orderData.shippingAddress.zip,
                        country: 'US'
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            // Save order to Firestore
            orderData.paymentMethodId = paymentMethod.id;
            orderData.total = total;

            if (typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection('orders').add(orderData);
            }

            // In production, you would:
            // 1. Send payment method ID to your server
            // 2. Create payment intent on server
            // 3. Confirm payment on server
            // 4. Return success/failure to client

            alert('Order placed successfully! You will receive a confirmation email shortly.');

            // Close modal and reset form
            closeCheckout();
            checkoutForm.reset();
            cardElement.clear();

        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed: ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Purchase';
        }
    });
}

// ============================================
// PRODUCT FILTERING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.product-categories .category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// ============================================
// IMPORTANT SETUP NOTES
// ============================================

/*
STRIPE SETUP INSTRUCTIONS:

1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/apikeys
3. Replace 'pk_test_YOUR_PUBLISHABLE_KEY_HERE' with your actual publishable key
4. For production:
   - Use live mode keys (pk_live_...)
   - Set up a server-side endpoint to create payment intents
   - Never expose secret keys in client-side code
   - Implement proper webhook handling for payment confirmations

5. Backend requirements (not included in this client-side code):
   - Create payment intent endpoint
   - Handle webhook events
   - Manage order fulfillment
   - Send confirmation emails

Example server endpoint (Node.js):
```
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Amount in cents
    currency: 'usd',
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});
```
*/
