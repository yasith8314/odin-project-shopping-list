CREATE DATABASE IF NOT EXISTS gameapp;
USE gameapp;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  favorites JSON DEFAULT NULL,
  platform VARCHAR(50) NOT NULL DEFAULT 'all',
  theme VARCHAR(20) NOT NULL DEFAULT 'dark',
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_one_per_game_per_user UNIQUE (user_id, game_id),
  INDEX reviews_game_id_idx (game_id)
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_type VARCHAR(40) NOT NULL,
  game_id INT DEFAULT NULL,
  metadata JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT analytics_events_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX analytics_events_type_created_idx (event_type, created_at),
  INDEX analytics_events_game_id_idx (game_id)
);

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
  PRIMARY KEY (list_id, game_id),
  CONSTRAINT shared_list_items_list_fk FOREIGN KEY (list_id) REFERENCES shared_lists(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_comments (
  id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, game_id INT NOT NULL,
  parent_id INT DEFAULT NULL, body VARCHAR(2000) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT comments_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT comments_parent_fk FOREIGN KEY (parent_id) REFERENCES game_comments(id) ON DELETE CASCADE,
  INDEX comments_game_idx (game_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(40) NOT NULL,
  message VARCHAR(255) NOT NULL, link VARCHAR(255) DEFAULT NULL, is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX notifications_user_read_idx (user_id, is_read, created_at)
);
