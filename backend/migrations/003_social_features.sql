CREATE TABLE IF NOT EXISTS follows (
  follower_id INT NOT NULL, followed_id INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, followed_id),
  CONSTRAINT follows_follower_fk FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT follows_followed_fk FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS shared_lists (
  id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(120) NOT NULL,
  description VARCHAR(500) DEFAULT '', is_public BOOLEAN NOT NULL DEFAULT TRUE,
  share_token CHAR(36) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT shared_lists_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS shared_list_items (
  list_id INT NOT NULL, game_id INT NOT NULL, position TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (list_id, game_id), CONSTRAINT shared_list_items_list_fk FOREIGN KEY (list_id) REFERENCES shared_lists(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS game_comments (
  id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, game_id INT NOT NULL,
  parent_id INT DEFAULT NULL, body VARCHAR(2000) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT comments_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT comments_parent_fk FOREIGN KEY (parent_id) REFERENCES game_comments(id) ON DELETE CASCADE,
  INDEX comments_game_idx (game_id)
);
