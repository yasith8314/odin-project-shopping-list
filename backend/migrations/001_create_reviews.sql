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
