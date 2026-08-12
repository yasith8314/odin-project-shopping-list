CREATE TABLE IF NOT EXISTS notifications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, type VARCHAR(40) NOT NULL,
  message VARCHAR(255) NOT NULL, link VARCHAR(255) DEFAULT NULL, is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX notifications_user_read_idx (user_id, is_read, created_at)
);
