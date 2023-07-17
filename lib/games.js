class Games {
    constructor() {
        this.games = global.config.GAMES;
    };

    getGameById(gameId) {
        return this.games.find(g => g.ids[gameId]);
    };

    getGameByVersion(version) {
        return this.games.find(g => g.version == version);
    };

    isAvailable(idOrVersion) {
        const game = this.getGameById(idOrVersion) || this.getGameByVersion(idOrVersion);
        if (!game) return false; // no game found
        if (game.isAvailable && game.isAvailable == false) return false; // game obj has isAvailable false
        if (game.ids[idOrVersion] && game.ids[idOrVersion]?.isAvailable == false) return false; // game obj's ids has isAvailable false id
        return true;
    };
};

module.exports = Games;