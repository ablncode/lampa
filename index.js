const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const express = require('express');
const cors = require('cors'); // Перевірте, чи є цей рядок
const app = express();

app.use(cors()); // ЦЕ ОБОВ'ЯЗКОВО! Дозволяє Lampa підключатися до сервера

const app = express();
app.use(cors()); // Allow requests from any device

const PORT = process.env.PORT || 3000;

// Search function for UAKino
async function searchUAKino(query) {
    try {
        const searchUrl = `https://uakino.best/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        
        let results = [];
        $('.movie-item').each((i, el) => {
            const link = $(el).find('a').attr('href');
            if (link) {
                results.push({
                    title: $(el).find('.movie-title').text().trim(),
                    link: link,
                    img: 'https://uakino.best' + $(el).find('img').attr('src')
                });
            }
        });
        return results;
    } catch (e) { return []; }
}

// Endpoint for search
app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "No query" });

    const uakinoResults = await searchUAKino(query);
    res.json({ items: uakinoResults });
});

// Endpoint for extracting player iframe
app.get('/extract', async (req, res) => {
    const url = req.query.url;
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const iframeSrc = $('iframe').attr('src'); 
        res.json({ stream_url: iframeSrc });
    } catch (e) {
        res.status(500).json({ error: "Failed to extract video" });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
