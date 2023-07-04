LOAD CSV WITH HEADERS FROM 'file:///release.csv' AS row
CREATE (r:Release {
  id: row.id, 
  title: row.title, 
  released: row.released, 
  country: row.country,
  master_id: toInteger(row.master_id),
  status: row.status
})
RETURN r
LIMIT 5;
```
+-----------------------------------------------------------------------------------------------------------------------------------------------+
| r                                                                                                                                             |
+-----------------------------------------------------------------------------------------------------------------------------------------------+
| (:Release {master_id: 80343, country: "UK", id: "261", title: "GAK", released: "1994-06-06", status: "Accepted"})                             |
| (:Release {country: "France", id: "2007", title: "A Brand New Life", released: "2000-06-00", status: "Accepted"})                             |
| (:Release {master_id: 34489, country: "US", id: "4178", title: "People Make The World Go Round", released: "2000-02-00", status: "Accepted"}) |
| (:Release {master_id: 16209, country: "Germany", id: "4749", title: "Circus Bells", released: "2001", status: "Accepted"})                    |
| (:Release {master_id: 5721, country: "Belgium", id: "5178", title: "I'm Strong", released: "1993", status: "Accepted"})                       |
+-----------------------------------------------------------------------------------------------------------------------------------------------+

5 rows
ready to start consuming query after 43 ms, results consumed after another 238 ms
Added 8134 nodes, Set 44157 properties, Added 8134 labels
```

LOAD CSV WITH HEADERS FROM 'file:///release_artist.csv' AS row
MERGE (a:Artist { artist_id: row.artist_id, artist_name: row.artist_name, extra: row.extra, anv: coalesce(row.anv, "Unknown"), position: row.position, join_string: coalesce(row.join_string, "Unknown"),  role: coalesce(row.role, "Unknown"), tracks: coalesce(row.tracks, "Unknown") })
WITH a, row
MATCH (r:Release { id: row.release_id })
CREATE (r)-[:HAS_ARTIST]->(a)
RETURN r, a
LIMIT 5;

```
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| r                                                                                                                 | a                                                
                                                                                                                                                         |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| (:Release {master_id: 80343, country: "UK", id: "261", title: "GAK", released: "1994-06-06", status: "Accepted"}) | (:Artist {role: "Unknown", join_string: "Unknown", artist_name: "GAK", extra: "0", anv: "Unknown", position: "1", artist_id: "46", tracks: "Unknown"})                                                    |
| (:Release {master_id: 80343, country: "UK", id: "261", title: "GAK", released: "1994-06-06", status: "Accepted"}) | (:Artist {role: "Artwork", join_string: "Unknown", artist_name: "The Designers Republic", extra: "1", anv: "The Designers Republic... naturally", position: "1", artist_id: "445854", tracks: "Unknown"}) |
| (:Release {master_id: 80343, country: "UK", id: "261", title: "GAK", released: "1994-06-06", status: "Accepted"}) | (:Artist {role: "Written-By, Producer", join_string: "Unknown", artist_name: "GAK", extra: "1", anv: "Unknown", position: "2", artist_id: "46", tracks: "Unknown"})                                       |
| (:Release {country: "France", id: "2007", title: "A Brand New Life", released: "2000-06-00", status: "Accepted"}) | (:Artist {role: "Unknown", join_string: "Unknown", artist_name: "Le Dav", extra: "0", anv: "Unknown", position: "1", artist_id: "2504", tracks: "Unknown"})                                               |
| (:Release {country: "France", id: "2007", title: "A Brand New Life", released: "2000-06-00", status: "Accepted"}) | (:Artist {role: "Written-By", join_string: "Unknown", artist_name: "David Duriez", extra: "1", anv: "Unknown", position: "1", artist_id: "2027", tracks: "Unknown"})                                      |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

5 rows
ready to start consuming query after 147 ms, results consumed after another 579377 ms
Added 38696 nodes, Created 40171 relationships, Set 309568 properties, Added 38696 labels
```


LOAD CSV WITH HEADERS FROM 'file:///release_style.csv' AS row
MERGE (s:Style { style: row.style })
WITH s, row
MATCH (r:Release { id: row.release_id })
CREATE (r)-[:HAS_STYLE]->(s)
RETURN r, s
LIMIT 5;



LOAD CSV WITH HEADERS FROM 'file:///release_genre.csv' AS row
MERGE (g:Genre { genre: row.genre })
WITH g, row
MATCH (r:Release { id: row.release_id })
CREATE (r)-[:HAS_GENRE]->(g)
RETURN r, g
LIMIT 5;

CALL db.schema.visualization();

```	
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| nodes                                                                                                                                                                
                                                                      | relationships                               |
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| [(:Artist {name: "Artist", indexes: [], constraints: []}), (:Style {name: "Style", indexes: [], constraints: []}), (:Genre {name: "Genre", indexes: [], constraints: []}), (:Release {name: "Release", indexes: ["id"], constraints: []})] | [[:HAS_ARTIST], [:HAS_GENRE], [:HAS_STYLE]] |
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```	


MATCH (a:Artist {artist_name: "Thom Bell"})-[:HAS_STYLE]->(s:Style)
WITH a, COLLECT(s) AS a_styles
MATCH (b:Artist)-[:HAS_STYLE]->(s:Style)
WITH a, a_styles, b, COLLECT(s) AS b_styles
WHERE a <> b
WITH a, b, apoc.algo.Jaccard(a_styles, b_styles) AS jaccard
ORDER BY jaccard DESC
LIMIT 10
MATCH (b)-[:HAS_RELEASE]->(r:Release)
RETURN b as Artist, COLLECT(r) AS Recommendations


MATCH (a:Artist {artist_name: "Thom Bell"})-[:HAS_ARTIST]->(r:Release)<-[:HAS_ARTIST]-(similar:Artist),
      (r)-[:HAS_GENRE]->(g:Genre),
      (r)-[:HAS_STYLE]->(s:Style)
WITH similar, count(distinct g) as commonGenres, count(distinct s) as commonStyles
ORDER BY commonGenres DESC, commonStyles DESC
LIMIT 10
MATCH (similar)-[:HAS_ARTIST]->(rec:Release)
RETURN rec as RecommendedRelease, similar as SimilarArtist



MATCH (a:Artist {artist_name: "Thom Bell"})<-[:HAS_ARTIST]-(r:Release)-[:HAS_ARTIST]->(similar:Artist),
      (r)-[:HAS_GENRE]->(g:Genre),  
      (r)-[:HAS_STYLE]->(s:Style)
WITH similar, count(distinct g) as commonGenres, count(distinct s) as commonStyles
ORDER BY commonGenres DESC, commonStyles DESC
LIMIT 10
MATCH (similar)<-[:HAS_ARTIST]-(rec:Release)
RETURN rec;