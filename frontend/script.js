document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('lang-selector');

    // --- The Core Translation Function ---
    const fetchAndApplyTranslations = async (lang) => {
        try {
            // Fetch the JSON file from our FastAPI backend
            // const response = await fetch(`http://127.0.0.1:8000/lang/${lang}`);
            const response = await fetch(`https://digit-tally-demo-be-2.onrender.com/lang/${lang}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const translations = await response.json();

            // Find all elements with a 'data-key' attribute
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });

            // Save the user's preference in localStorage
            localStorage.setItem('selectedLanguage', lang);

        } catch (error) {
            console.error('Error fetching or applying translations:', error);
        }
    };

    // --- Event Listener for the Language Selector ---
    langSelector.addEventListener('change', (event) => {
        fetchAndApplyTranslations(event.target.value);
    });

    // --- On Page Load: Check for a Saved Language ---
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to English
    langSelector.value = savedLang; // Set the dropdown to the saved language
    fetchAndApplyTranslations(savedLang); // Load the translations
});