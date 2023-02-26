\c nc_news_test

-- SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
-- FROM articles
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
-- ORDER BY articles.created_at DESC;

-- SELECT comment_id, votes, created_at, author, body, article_id
-- FROM comments
-- WHERE article_id = 1
-- ORDER BY created_at DESC;

DELETE FROM articles WHERE article_id = 1 RETURNING *;