var path = require('path')
var fs = require('fs')

var LYRICS_PATH = path.resolve(__dirname, 'songs')

var db = {
    lyrics: [],
    groups: [],
}

// Fill the database
var files = fs.readdirSync(LYRICS_PATH);

files.forEach(file => {
    var filePath = path.resolve(LYRICS_PATH, file)
    var fileContent = fs.readFileSync(filePath)
    var info = JSON.parse(fileContent)

    db.groups.push({ name: info.group, id: info.groupId })
    db.lyrics.push(info)
})

// Remove duplicates
db.groups = db.groups.reduce((stored, group) => {
    if (stored.some(g => g.id == group.id)) {
        return stored
    }

    return [...stored, group]
}, [])


// Exports

exports.getGroups = function() {
    return db.groups.sort(function(a, b) {
        return a.name > b.name
    })
}

exports.getSongsByGroup = function(groupId) {
    return db.lyrics
        .filter(song => song.groupId === groupId)
        .map(song => {
            return {
                id: song.id,
                group: song.group,
                groupId: song.groupId,
                title: song.title,
                color: song.color
            }
        })
        .sort(function(a, b) {
            return a.title > b.title
        })
}

exports.getSongById = function(id) {
  return db.lyrics.find(song => song.id === id)
}

exports.getAllSongs = function() {
    return db.lyrics.sort(function(a, b) {
        return a.title > b.title
    });
}
