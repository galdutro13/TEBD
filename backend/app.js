const express = require('express');
const cors = require('cors');

const neo4j = require('neo4j-driver')

const driver = neo4j.driver("neo4j://localhost", neo4j.auth.basic("neo4j", "06041911"));
const session = driver.session();

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    try {
        const serverInfo = await driver.getServerInfo();
        console.log('Connection established');
        res.send(serverInfo);
    } catch (e) {
        console.log(e);
    }
});

app.get('/search', async (req, res) => {
    const releaseQuery = req.query.query;

    var queryID = '';
    var queryStyle = '';
    var queryGenre = '';
    var queryReleases = [];
    var artistReleasesMap = {};

    try {
        await session.run(
            "MATCH (r:Release) WHERE apoc.text.fuzzyMatch(r.title, $title) = TRUE RETURN r",
            { title: releaseQuery }
        ).then(result => {
            result.records.forEach(record => {
                queryID = record.get('r').properties.id
            });
        });

        if(queryID == '') {
            await session.run(
                "MATCH (r:Release) WHERE apoc.text.distance(r.title, $title) < 5 RETURN r",
                { title: releaseQuery }
            ).then(result => {
                result.records.forEach(record => {
                    queryID = record.get('r').properties.id
                });
            });
        }

        await session.run(
            "MATCH (s:Style)<-[:HAS_STYLE]-(r:Release) WHERE r.id = $id RETURN s",
            { id: queryID }
        ).then(result2 => {
            result2.records.forEach(record => {
                queryStyle = record.get('s').properties.style
            });
        });

        await session.run(
            "MATCH (g:Genre)<-[:HAS_GENRE]-(r:Release) WHERE r.id = $id RETURN g",
            { id: queryID }
        ).then(result2 => {
            result2.records.forEach(record => {
                queryGenre = record.get('g').properties.genre
            });
        });

        await session.run(
            "MATCH (r:Release)-[:HAS_STYLE]->(s:Style) WHERE s.style = $style RETURN r",
            { style: queryStyle }
        ).then(async result3 => {
            result3.records.forEach(record => {
                if (record.get('r').properties.id != queryID) {
                    var releaseObj = {
                        id: record.get('r').properties.id,
                        title: record.get('r').properties.title
                    };
                    queryReleases.push(releaseObj);
                }
            });
        
            // If less than 3 releases found, fetch more by genre
            if(queryReleases.length < 3) {
                await session.run(
                    "MATCH (r:Release)-[:HAS_GENRE]->(g:Genre) WHERE g.genre = $genre RETURN r",
                    { genre: queryGenre } // change this to the correct genre variable if different
                ).then(result4 => {
                    result4.records.forEach(record => {
                        if (record.get('r').properties.id != queryID) {
                            var releaseObj = {
                                id: record.get('r').properties.id,
                                title: record.get('r').properties.title
                            };
                            queryReleases.push(releaseObj);
                        }
                    });
                });
            }
        });

        for(let i = 0; i < queryReleases.length; i++){
            await session.run(
                "MATCH (a:Artist)<-[:HAS_ARTIST]-(r:Release) WHERE r.id = $id RETURN a",
                { id: queryReleases[i].id }
            ).then(result4 => {
                result4.records.forEach(record => {
                    if (!artistReleasesMap[queryReleases[i].title]) {
                        artistReleasesMap[queryReleases[i].title] = [];
                    }
                    artistReleasesMap[queryReleases[i].title].push(record.get('a').properties.artist_name);
                });
            });
        }

        const artistReleases = Object.entries(artistReleasesMap).map(([title, artists]) => ({
            title,
            artists: artists.join(', ')
        }));

        res.json({ releases: artistReleases.slice(0, 10) });

    } catch (e) {
        console.log(e);
    }
});

app.listen(4000, () => {
    console.log("Listening on port 4000!");
});
