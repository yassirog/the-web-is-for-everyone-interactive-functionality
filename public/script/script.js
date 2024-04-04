document.addEventListener('DOMContentLoaded', function() {
    const options = document.querySelectorAll('.option');

    options.forEach(option => {
        option.addEventListener('click', function() {
            // Reset de achtergrondkleur en tekstkleur van alle opties behalve de geselecteerde optie
            options.forEach(opt => {
                if (opt !== option) {
                    opt.style.backgroundColor = 'white';
                    opt.querySelector('span').style.color = '#808080';
                }
            });

            // Set de achtergrondkleur en tekstkleur van de geklikte optie naar paars en wit
            option.style.backgroundColor = '#AD97C9';
            option.querySelector('span').style.color = 'white';
        });
    });
});
