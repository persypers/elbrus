module.exports = {
    start : 'start',
    replies : {
        start : {
            text : 'Мелкие капли дождя скатываются по стеклу в никуда.',
            topics : ['watch', 'end', 'jump'],
        },
        jump_reply : {
            text : 'Взобравшись на подоконник, вы в последний раз оглядели своё печальное жилище и шагнули в нежные объятия неизвестности.',
            script : ()=>{cc.playerNode.destroy()},
        },
        watch_reply : {
            text : 'Некоторое время вы наблюдаете за уличной суетой. Вам не становится сильно легче.',
            topics : ['watch', 'end', 'jump'],
        },
    },
    topics : {
        jump : {
            text : 'Выброситься из окна',
            reply : 'jump_reply',
        },
        watch : {
            text : 'Созерцать мир за окном',
            reply : 'watch_reply',
        },
        end : {
            text : 'Вернуться в насущным проблемам'
        }
    }
}