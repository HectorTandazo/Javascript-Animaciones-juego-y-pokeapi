var SoundManager = Class.extend({
    init: function() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.musicVolume = 0.7;
        this.effectsVolume = 0.8;
        this.muted = false;
        this.loadSounds();
    },

    loadSounds: function() {
        // Efectos de sonido
        this.sounds = {
            'jump': new Audio('Content/sound/effects/jump.mp3'),
            'coin': new Audio('Content/sound/effects/coin.mp3'),
            'powerup': new Audio('Content/sound/effects/consume-powerup.mp3'),
            'powerdown': new Audio('Content/sound/effects/powerdown.mp3'),
            'powerup-appears': new Audio('Content/sound/effects/powerup-appears.mp3'),
            'enemy_die': new Audio('Content/sound/effects/goomba-stomp.wav'),
            'shell': new Audio('Content/sound/effects/kick.mp3'),
            'shoot': new Audio('Content/sound/effects/fireball.mp3'),
            'grow': new Audio('Content/sound/effects/powerup-appears.mp3'),
            'hurt': new Audio('Content/sound/effects/powerdown.mp3'),
            'liveupgrade': new Audio('Content/sound/effects/here-we-go.mp3'),
            'mushroom': new Audio('Content/sound/effects/powerup-appears.mp3'),
            'block-bump': new Audio('Content/sound/effects/block-bump.wav'),
            'break-block': new Audio('Content/sound/effects/break-block.wav'),
            'flagpole': new Audio('Content/sound/effects/flagpole.mp3'),
            'pause': new Audio('Content/sound/effects/pause.wav'),
            'time-warning': new Audio('Content/sound/effects/time-warning.mp3')
        };

        // Música
        this.music = {
            'overworld': new Audio('Content/sound/music/overworld/theme.mp3'),
            'overworld-hurry': new Audio('Content/sound/music/overworld/hurry-up-theme.mp3'),
            'underground': new Audio('Content/sound/music/underground/theme.mp3'),
            'underground-hurry': new Audio('Content/sound/music/underground/hurry-up-theme.mp3'),
            'invincibility': new Audio('Content/sound/effects/here-we-go.mp3'),
            'success': new Audio('Content/sound/music/win.wav'),
            'die': new Audio('Content/sound/music/gameover.mp3')
        };

        // Configurar propiedades de audio
        for (var key in this.sounds) {
            this.sounds[key].volume = this.effectsVolume;
            this.sounds[key].preload = 'auto';
        }

        for (var key in this.music) {
            this.music[key].volume = this.musicVolume;
            this.music[key].preload = 'auto';
            if (key.includes('overworld') || key.includes('underground')) {
                this.music[key].loop = true;
            }
        }
    },

    play: function(soundName) {
        if (this.muted || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play();
        } catch (e) {
            console.log('Error playing sound: ' + soundName);
        }
    },

    playMusic: function(musicName) {
        if (this.muted || !this.music[musicName]) return;

        this.stopMusic();
        
        try {
            this.currentMusic = this.music[musicName];
            this.currentMusic.currentTime = 0;
            this.currentMusic.play();
        } catch (e) {
            console.log('Error playing music: ' + musicName);
        }
    },

    sideMusic: function(musicName) {
        this.playMusic(musicName);
    },

    stopMusic: function() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    },

    setMusicVolume: function(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        for (var key in this.music) {
            this.music[key].volume = this.musicVolume;
        }
    },

    setEffectsVolume: function(volume) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        for (var key in this.sounds) {
            this.sounds[key].volume = this.effectsVolume;
        }
    },

    stopAllSounds: function() {
        // Detener todos los efectos de sonido
        for (var key in this.sounds) {
            if (this.sounds[key]) {
                this.sounds[key].pause();
                this.sounds[key].currentTime = 0;
            }
        }
        // Detener música
        this.stopMusic();
    },

    toggleMute: function() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        }
        return this.muted;
    }
});