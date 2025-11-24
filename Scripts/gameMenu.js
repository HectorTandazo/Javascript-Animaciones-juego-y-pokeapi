var GameMenu = {
    isVisible: true,
    savedGame: null,

    init: function() {
        this.createMenuHTML();
        this.loadSavedGame();
        this.bindEvents();
    },

    createMenuHTML: function() {
        var menuHTML = `
            <div id="gameMenu">
                <h1 class="menu-title">SUPER MARIO BROS</h1>
                <div class="menu-buttons">
                    <button class="menu-btn" id="newGameBtn">🍄 NUEVO JUEGO</button>
                    <button class="menu-btn" id="continueBtn" ${this.savedGame ? '' : 'style="display:none"'}>⭐ CONTINUAR</button>
                </div>
                <div class="menu-controls">
                    <p>🕹️ Controles: ← → Mover | ↑ Saltar | Espacio Disparar | A/Ctrl Correr</p>
                </div>
            </div>
        `;
        
        document.getElementById('game').insertAdjacentHTML('afterbegin', menuHTML);
    },

    bindEvents: function() {
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.startNewGame();
        });

        if (this.savedGame) {
            document.getElementById('continueBtn').addEventListener('click', () => {
                this.continueGame();
            });
        }
    },

    startNewGame: function() {
        localStorage.removeItem('marioSaveGame');
        this.cleanupGame();
        this.hideMenu();
        this.initializeGame();
    },

    continueGame: function() {
        this.cleanupGame();
        this.hideMenu();
        this.loadGame();
    },

    cleanupGame: function() {
        if (gameLevel) {
            gameLevel.pause();
            if (gameLevel.soundManager) {
                gameLevel.soundManager.stopMusic();
                gameLevel.soundManager.stopAllSounds();
            }
            gameLevel.reset();
        }
        keys.reset();
        $('#world').empty();
    },

    hideMenu: function() {
        document.getElementById('gameMenu').classList.add('hidden');
        this.isVisible = false;
    },

    showMenu: function() {
        if (document.getElementById('gameMenu')) {
            document.getElementById('gameMenu').classList.remove('hidden');
        } else {
            this.init();
        }
        this.isVisible = true;
    },

    saveGame: function(gameData) {
        var saveData = {
            level: gameData.level || 0,
            lives: gameData.lives || 3,
            coins: gameData.coins || 0,
            score: gameData.score || 0,
            timestamp: Date.now()
        };
        localStorage.setItem('marioSaveGame', JSON.stringify(saveData));
        this.savedGame = saveData;
    },

    loadSavedGame: function() {
        var saved = localStorage.getItem('marioSaveGame');
        if (saved) {
            this.savedGame = JSON.parse(saved);
            // Mostrar botón continuar si existe partida guardada
            var continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
                continueBtn.style.display = 'block';
            }
        }
    },

    initializeGame: function() {
        // Inicializar juego nuevo
        gameLevel = new Level('world');
        gameLevel.load(definedLevels[0]);
        gameLevel.start();
    },

    loadGame: function() {
        // Cargar juego guardado
        if (this.savedGame) {
            gameLevel = new Level('world');
            gameLevel.load(definedLevels[this.savedGame.level || 0]);
            
            // Restaurar datos del jugador
            for (var i = gameLevel.figures.length; i--;) {
                if (gameLevel.figures[i] instanceof Mario) {
                    gameLevel.figures[i].setLifes(this.savedGame.lives);
                    gameLevel.figures[i].setCoins(this.savedGame.coins);
                    break;
                }
            }
            
            gameLevel.score = this.savedGame.score;
            gameLevel.start();
        } else {
            this.initializeGame();
        }
    }
};