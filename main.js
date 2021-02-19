// The Speech Synth API being initialized
const synth = window.speechSynthesis;


// Getting all the DOM elements
const form = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');


// Get the voices in your browser
let voices = [];

const getVoices = () => {
    // This is called async with the synth.onvoiceschanged method 
    voices = synth.getVoices();  

    voices.forEach((voice) => {
        // Creating options for the select voices in the DOM
        const option = document.createElement('option');
        option.textContent = voice.name + '(' + voice.lang + ')';

        // Adding needed attributes to the option tag as per MDN docs
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);

        // Adding these options to the select element
        voiceSelect.appendChild(option);
    });
    
};

getVoices()
if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;  
}

// Speak out the text entered

const speak = () => {
    // Check if already speaking
    if(synth.speaking) {
        // We dont want to start the phrase again if the API is already synthsizing speech
        // so we just return 
        return;
    }

    

    if (textInput.value !== '') {
        const toSpeak = new SpeechSynthesisUtterance(textInput.value);

        // Background animation
        body.style.background = '#141414 url(/img/wave.gif)';
        body.style.backgroundSize = '100% 100%';
    

        // Selected voice 
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        voices.forEach((voice) => {
            if(voice.name === selectedVoice){
                toSpeak.voice = voice;
            }
        });

        // Set Pitch and Rate
        toSpeak.rate = rate.value;
        toSpeak.pitch = pitch.value;

        // Speak!
        synth.speak(toSpeak);
        

        // After speaking is done
        toSpeak.onend = e => {
            body.style.background = '#141414';
        }

        // Error in speaking
        toSpeak.onerror = e => {
            console.error('Something unexpected happened!')
        }
    }
}

// Listening to events

form.addEventListener('submit', (e) => {
    e.preventDefault();
    speak();
    textInput.blur();
});

// Changing the voice will also trigger the API to speak again
voiceSelect.addEventListener('change', () => speak());

// Rate slider changes the rate value above
rate.addEventListener('change', e => rateValue.textContent = rate.value);

// Pitch slider changes the pitch value above
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);

