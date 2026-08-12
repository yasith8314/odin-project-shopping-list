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
