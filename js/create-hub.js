// Great Minds Creating - Create Hub
// Booking Form and Media Management

// ============================================
// BOOKING FORM SUBMISSION
// ============================================

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const bookingData = {
            name: document.getElementById('bookingName').value,
            email: document.getElementById('bookingEmail').value,
            phone: document.getElementById('bookingPhone').value,
            service: document.getElementById('bookingService').value,
            description: document.getElementById('bookingDescription').value,
            preferredDate: document.getElementById('bookingDate').value,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        try {
            // Save to Firestore
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection('bookings').add(bookingData);
                console.log('Booking submitted successfully');

                alert('Thank you! Your booking request has been submitted. We will contact you soon.');

                // Reset form
                bookingForm.reset();
            } else {
                alert('Booking system is not connected. Please try again later.');
            }

        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to submit booking. Please try again or contact us directly.');
        }
    });
}

// ============================================
// SCROLL TO BOOKING
// ============================================

function scrollToBooking(service) {
    const bookingSection = document.getElementById('bookingSection');
    const serviceSelect = document.getElementById('bookingService');

    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });

        if (serviceSelect && service) {
            setTimeout(() => {
                serviceSelect.value = service;
                serviceSelect.focus();
            }, 500);
        }
    }
}

// Make function globally available
window.scrollToBooking = scrollToBooking;
