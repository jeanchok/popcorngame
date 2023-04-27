import React from 'react';
import { useSoundOn, useSoundUpdate } from '.././context/SoundContext';

const SoundButton = () => {
    const soundOn = useSoundOn();
    const toggleSoundOn = useSoundUpdate();

    return (
        <button onClick={toggleSoundOn}>
            {
                soundOn ?
                    <img src="/img/soundOn.webp" alt="sound icone on" />
                    :
                    <img src="/img/soundOff.webp" alt="sound icone off" />
            }
        </button>
    );
};

export default SoundButton;