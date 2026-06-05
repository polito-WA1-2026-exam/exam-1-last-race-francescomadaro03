function User(username, password, salt) {
    this.username = username,
        this.password = password,
        this.salt = salt;
}

function NetworkEntry(line_id, station_id, station_name, line_name, order, color) {
    this.line_id = line_id;
    this.station_id = station_id;
    this.station_name = station_name;
    this.line_name = line_name;
    this.order = order;
    this.color = color;
}

function Event(event_id, name, bonus, weight) {
    this.event_id = event_id;
    this.name = name;
    this.bonus = bonus;
    this.weight = weight;
}

function Game(game_id, username, score) {
    this.game_id = game_id;
    this.username = username;
    this.score = score;
}

export { User, NetworkEntry, Event, Game };
