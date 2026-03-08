// Great Minds Creating - Polls System
// Fan Voting and Poll Management

// Sample polls
const SAMPLE_POLLS = [
    {
        id: 'poll1',
        question: 'Favorite Artist of the Month',
        options: ['Jay Bando Baby', 'B Blazo', 'Cash Create'],
        votes: {}
    },
    {
        id: 'poll2',
        question: 'Favorite Song of the Month',
        options: ['Track 1', 'Track 2', 'Track 3', 'Track 4'],
        votes: {}
    },
    {
        id: 'poll3',
        question: 'Which Song Should Get a Music Video Next?',
        options: ['Song A', 'Song B', 'Song C'],
        votes: {}
    }
];

// ============================================
// LOAD POLLS
// ============================================

async function loadPolls() {
    const pollsContainer = document.getElementById('pollsContainer');
    if (!pollsContainer) return;

    try {
        let polls = [];

        // Try to load from Firestore
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const snapshot = await firebase.firestore()
                .collection('polls')
                .where('active', '==', true)
                .get();

            if (!snapshot.empty) {
                polls = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            }
        }

        // Use sample polls if none in database
        if (polls.length === 0) {
            polls = SAMPLE_POLLS;
        }

        // Render polls
        pollsContainer.innerHTML = '';
        polls.forEach(poll => {
            const pollCard = createPollCard(poll);
            pollsContainer.appendChild(pollCard);
        });

    } catch (error) {
        console.error('Error loading polls:', error);
        // Show sample polls on error
        pollsContainer.innerHTML = '';
        SAMPLE_POLLS.forEach(poll => {
            const pollCard = createPollCard(poll);
            pollsContainer.appendChild(pollCard);
        });
    }
}

// ============================================
// CREATE POLL CARD
// ============================================

function createPollCard(poll) {
    const card = document.createElement('div');
    card.className = 'poll-card';
    card.dataset.pollId = poll.id;

    const title = document.createElement('h3');
    title.textContent = poll.question;
    card.appendChild(title);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'poll-options';

    poll.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'poll-option';
        optionDiv.textContent = option;
        optionDiv.dataset.option = option;

        // Check if user has already voted
        const hasVoted = checkIfVoted(poll.id);
        if (hasVoted) {
            optionDiv.style.pointerEvents = 'none';
            if (hasVoted === option) {
                optionDiv.classList.add('voted');
            }
        } else {
            optionDiv.addEventListener('click', () => votePoll(poll.id, option));
        }

        optionsContainer.appendChild(optionDiv);
    });

    card.appendChild(optionsContainer);

    return card;
}

// ============================================
// VOTE ON POLL
// ============================================

async function votePoll(pollId, option) {
    try {
        // Check if user is logged in
        const user = firebase.auth().currentUser;

        if (!user) {
            alert('Please log in or sign up to vote!');
            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.style.display = 'block';
            return;
        }

        // Check if already voted
        const hasVoted = checkIfVoted(pollId);
        if (hasVoted) {
            alert('You have already voted on this poll!');
            return;
        }

        // Save vote to Firestore
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            await firebase.firestore().collection('votes').add({
                pollId: pollId,
                userId: user.uid,
                option: option,
                votedAt: new Date().toISOString()
            });

            // Update poll vote count
            const pollRef = firebase.firestore().collection('polls').doc(pollId);
            await pollRef.update({
                [`votes.${option}`]: firebase.firestore.FieldValue.increment(1)
            });
        }

        // Store in localStorage
        localStorage.setItem(`poll_${pollId}`, option);

        // Update UI
        const pollCard = document.querySelector(`[data-poll-id="${pollId}"]`);
        if (pollCard) {
            const options = pollCard.querySelectorAll('.poll-option');
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
                if (opt.dataset.option === option) {
                    opt.classList.add('voted');
                }
            });
        }

        alert('Thank you for voting!');

    } catch (error) {
        console.error('Vote error:', error);
        alert('Failed to submit vote. Please try again.');
    }
}

// ============================================
// CHECK IF VOTED
// ============================================

function checkIfVoted(pollId) {
    // Check localStorage
    return localStorage.getItem(`poll_${pollId}`);
}

// ============================================
// ADMIN: VIEW POLL RESULTS
// ============================================

async function viewPollResults(pollId) {
    try {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const pollDoc = await firebase.firestore()
                .collection('polls')
                .doc(pollId)
                .get();

            if (pollDoc.exists) {
                const poll = pollDoc.data();
                console.log('Poll Results:', poll);

                // Display results (admin only)
                let resultsText = `Results for: ${poll.question}\n\n`;

                for (const [option, votes] of Object.entries(poll.votes || {})) {
                    resultsText += `${option}: ${votes} votes\n`;
                }

                alert(resultsText);
            }
        }
    } catch (error) {
        console.error('Error viewing results:', error);
    }
}

// ============================================
// ADMIN: CREATE POLL
// ============================================

async function createPoll(question, options) {
    try {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const pollData = {
                question: question,
                options: options,
                votes: {},
                active: true,
                createdAt: new Date().toISOString()
            };

            await firebase.firestore().collection('polls').add(pollData);
            console.log('Poll created successfully');

            // Reload polls
            await loadPolls();
        }
    } catch (error) {
        console.error('Error creating poll:', error);
        alert('Failed to create poll');
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadPolls();
});
