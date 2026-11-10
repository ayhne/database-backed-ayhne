CREATE TABLE article (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  body  text NOT NULL,
  date  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE article ENABLE ROW LEVEL SECURITY;
CREATE POLICY anonymous_read ON article FOR SELECT TO anonymous USING (true);
CREATE POLICY anonymous_insert ON article FOR INSERT TO anonymous WITH CHECK (true);

INSERT INTO article (title, body, date) VALUES
  (
    'There’s a fair tomorrow',
    E'Is a mháithrín an ligfidh tú chun aonaigh mé\nIs a mhuirnín óg ná healaí é\nBeidh aonach amárach in gContae an Chláir\nCén mhaith domh é ní bheidh mé ann',
    '2021-03-16'
  ),
  (
    'Hello Everyone',
    repeat(E'It is a good day to learn React and Firebase\n', 10),
    '2021-10-24'
  );

CREATE SCHEMA api;
CREATE VIEW api.articles WITH (security_invoker = true) AS SELECT * FROM article;

GRANT USAGE ON SCHEMA public TO anonymous;
GRANT USAGE ON SCHEMA api TO anonymous;
GRANT SELECT, INSERT ON article TO anonymous;        -- the view's caller needs base-table rights
GRANT SELECT, INSERT ON api.articles TO anonymous;

ALTER TABLE article ADD COLUMN user_id text;

UPDATE article SET user_id = 'seed' WHERE user_id IS NULL;  -- Marks pre-existing articles as “seed” data.

ALTER TABLE article
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN user_id SET DEFAULT (auth.user_id());


DROP POLICY anonymous_read ON article;
DROP POLICY anonymous_insert ON article;
REVOKE ALL ON article FROM anonymous;
REVOKE ALL ON api.articles FROM anonymous;
REVOKE USAGE ON SCHEMA public FROM anonymous;
REVOKE USAGE ON SCHEMA api FROM anonymous;

CREATE POLICY authenticated_read ON article FOR SELECT TO authenticated USING (true);
CREATE POLICY authenticated_insert_own ON article FOR INSERT TO authenticated WITH CHECK (user_id = auth.user_id());

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA api TO authenticated;
GRANT SELECT, INSERT ON article TO authenticated;
GRANT SELECT, INSERT ON api.articles TO authenticated;

CREATE OR REPLACE VIEW api.articles WITH (security_invoker = true) AS SELECT * FROM article;

CREATE POLICY authenticated_update_own
ON article
FOR UPDATE
TO authenticated
USING (user_id = auth.user_id())
WITH CHECK (user_id = auth.user_id());

GRANT UPDATE ON article TO authenticated;
GRANT UPDATE ON api.articles TO authenticated;

CREATE POLICY authenticated_delete_own
ON article
FOR DELETE
TO authenticated
USING (user_id = auth.user_id());

GRANT DELETE ON article TO authenticated;

GRANT DELETE ON api.articles TO authenticated;