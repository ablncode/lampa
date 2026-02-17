(function () {
    'use strict';

    function UA_Plugin(api) {
        var server_url = 'https://ВАШ_URL_НА_RENDER.onrender.com';

        this.search = function (params) {
            Lampa.Network.native(server_url + '/search?q=' + encodeURIComponent(params.query), function (data) {
                if (data && data.items) {
                    var items = data.items.map(function (item) {
                        return {
                            title: item.title,
                            url: item.link,
                            img: item.img,
                            id: item.link,
                            type: 'movie'
                        };
                    });
                    params.clbk(items);
                } else {
                    params.clbk([]);
                }
            }, function () {
                params.clbk([]);
            });
        };
    }

    function Start() {
        Lampa.Plugins.add({
            name: 'UA Media Hub',
            version: '1.0.0',
            description: 'Прямий доступ до UAKino та Eneyida',
            author: 'ablncode',
            onReady: function () {
                // Додаємо в пошукову видачу Lampa
                Lampa.Search.addSource(new UA_Plugin());
            }
        });
    }

    if (window.appready) Start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') Start();
    });
})();